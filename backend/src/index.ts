import axios from 'axios';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import { connectDatabase, client } from './utils/database/db';
import { loadDefaultDrivers } from './utils/database/loadDefaultDrivers';
import { handleAddCustomer, handleGetAllCustomers, handleGetAllDrivers, handleGetCustomerHistory, handleSaveRideHistory } from './utils/handles';
import { IConfirmRideReqBody, IRideReqBody } from './interfaces/ride.interface';
import { ICustomer, ICustomerHistory } from './interfaces/customer.interface';

const app = express();
const PORT = process.env.PORT || 8080;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

interface DirectionsResponse {
    routes: {
        legs: {
            distance: { value: number };
            duration: { value: number };
        }[];
    }[];
    status: string;
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH'],
    allowedHeaders: ['Content-Type']
}));

// Connect to the database
(async () => {
    try {
        await connectDatabase();
        await loadDefaultDrivers();
    } catch (error) {
        console.error('Failed to connect to PostgreSQL', error);
        process.exit(1);
    }
})();

app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({ message: 'Backend Working (⌐■_■)' });
});

app.get('/drivers', async (_req: Request, res: Response) => {
    try {
        const drivers = await handleGetAllDrivers();
        res.status(200).json(drivers);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to get drivers' });
    }
});

app.get('/customer/all', async (_req: Request, res: Response) => {
    try {
        const custormes = await handleGetAllCustomers();
        res.status(200).json(custormes);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to get custormes' });
    }
});

app.post('/customer/add', async (req: any, res: any) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({
            "error_core": 'INVALID_DATA',
            error_description: 'Data provided is invalid!'
        });
    }
    try {
        const customer = await handleAddCustomer(name);
        return res.status(200).json({ customer });
    } catch (error) {
        res.status(500).json({
            error_code: "DATABASE_ERROR",
            error_description: "Failed to create new customer.",
        });
    }
});

app.get('/ride/:customer_id', async (req: any, res: any) => {
    const { customer_id } = req.params;
    const { driver_id } = req.query;

    if (!customer_id) {
        return res.status(400).json({
            error_code: 'INVALID_CUSTOMER_ID',
            error_description: 'Customer ID cannot be empty',
        });
    }
    if (driver_id && isNaN(Number(driver_id))) {
        return res.status(400).json({
            error_code: 'INVALID_DRIVER',
            error_description: 'Driver ID must be a valid number',
        });
    }

    try {
        const history = await handleGetCustomerHistory(Number(customer_id));
        if (!history || history.length === 0) {
            return res.status(200).json({
                customer_id,
                rides: [],
            });
        }

        const filteredHistory = driver_id
            ? history.filter((ride) => ride.driver.id === Number(driver_id))
            : history;

        if (filteredHistory.length === 0) {
            return res.status(404).json({
                error_code: 'NO_RIDES_FOUND',
                error_description: 'No rides found for the specified driver',
            });
        }

        res.status(200).json({
            customer_id,
            rides: filteredHistory,
        });

    } catch (error) {
        console.error('Error retrieving rides:', error.message);
        res.status(500).json({
            error_code: 'SERVER_ERROR',
            error_description: 'An error occurred while retrieving the rides',
        });
    }
});

app.post('/ride/estimate', async (req: any, res: any) => {
    const { customer_id, origin, destination }: IRideReqBody = req.body;

    if (
        !customer_id ||
        !origin ||
        !destination
    ) {
        return res.status(400).json({
            "error_core": 'INVALID_DATA',
            error_description: 'Data provided is invalid!'
        });
    }

    if (origin === destination) {
        return res.status(400).json({ error: 'Origin and destination cannot be the same' });
    }

    const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin},${origin}&destination=${destination},${destination}&key=${GOOGLE_API_KEY}`;

    try {
        const response = await axios.get<DirectionsResponse>(apiUrl);
        if (response.data.status !== 'OK') {
            return res.status(500).json({ error: 'Failed to get directions from Google Maps' });
        }

        const route = response.data.routes[0];
        const leg = route.legs[0];
        const distance = leg.distance.value;
        const duration = leg.duration.value;
        const distanceKm = Math.round(distance / 1000);

        const queryDrivers = `
            SELECT * FROM drivers
            WHERE minimum_km <= $1
        `;
        const { rows: availableDrivers } = await client.query(queryDrivers, [distanceKm]);

        const driversWithCost = availableDrivers.map((driver) => {
            const costPerKm = parseFloat(driver.tax);
            const estimatedCost = distanceKm * costPerKm;
            return {
                ...driver,
                value: estimatedCost.toFixed(2),
            };
        });

        res.status(200).json({
            origin: origin,
            destination: destination,
            distance: distanceKm.toFixed(2),
            duration: (duration / 60).toFixed(2),
            options: driversWithCost,
        });

    } catch (error) {
        console.error('Error estimating ride:', error.message);
        res.status(500).json({ error: 'Failed to estimate ride' });
    }
});

app.patch('/ride/confirm', async (req: any, res: any) => {
    const { customer_id, origin, destination, distance, duration, driver, value }: IConfirmRideReqBody = req.body;

    if (
        !customer_id ||
        !destination ||
        !duration ||
        origin === destination &&
        origin === destination
    ) {
        return res.status(400).json({
            "error_core": 'INVALID_DATA',
            error_description: 'The data provided in the body of the request is invalid'
        });
    }
    if (!driver) return res.status(404).json({
        error_code: 'DRIVER_NOT_FOUND',
        error_description: "Driver not found"
    });
    if (!distance) return res.status(404).json({
        error_code: 'INVALID_DISTANCE"',
        error_description: "Invalid distance for the driver"
    });

    const rideHistory: ICustomerHistory = {
        date: new Date,
        driver,
        origin,
        destination,
        distance,
        duration,
        value,
    };

    try {
        const customer: ICustomer = {
            name: "testing",
            history: []
        }

        await handleSaveRideHistory(customer_id, rideHistory);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({
            error_code: "DATABASE_ERROR",
            error_description: "Failed to save ride history.",
        });
    }
});

app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});