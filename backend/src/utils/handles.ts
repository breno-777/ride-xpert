import { ICustomerHistory } from "../interfaces/customer.interface";
import { IDriver } from "../interfaces/driver.interface";
import { client } from "./database/db";

export const handleAddDriver = async (data: IDriver) => {
    const query = `
      INSERT INTO drivers (name, description, vehicle, review, tax, minimum_km)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    try {
        await client.query(query, [data.name, data.description, data.vehicle, data.review, data.tax, data.minimum_km]);
        console.log(`Driver ${data.name} added successfully!`);
    } catch (error) {
        console.error('Failed to add driver:', error.stack);
    }
};

export const handleGetAllDrivers = async () => {
    try {
        if (!client) throw new Error('Database client is not connected');

        const query = await client.query('SELECT * FROM drivers');
        console.log(query.rows);

        return query.rows;
    } catch (error) {
        throw new Error('Error getting drivers from the database!');
    }
}

export const handleSaveRideHistory = async (costumer_id: number, history: ICustomerHistory): Promise<void> => {
    const query = `
        UPDATE customers
        SET history = history || $2::jsonb
        WHERE id = $1
    `;
    try {
        await client.query(query, [costumer_id, JSON.stringify(history)]);
        console.log(`Costumer's ride history updated successfully!`);

    } catch (error) {
        throw new Error("Failed to save ride history.");
    }
}

export const handleGetCustomerHistory = async (customer_id: number): Promise<ICustomerHistory[]> => {
    try {
        const query = `
      SELECT history
      FROM customers
      WHERE id = $1
    `;
        const result = await client.query(query, [customer_id]);

        if (result.rows.length === 0) throw new Error(`Customer with ID ${customer_id} not found`);
        const history = result.rows[0].history as ICustomerHistory[];

        return history;
    } catch (error) {
        console.error(`Error fetching customer history for ID ${customer_id}:`, error);
        throw new Error('Failed to fetch customer history');
    }
}

export const handleAddCustomer = async (customerName: string) => {
    const query = `
      INSERT INTO customers (name)
      VALUES ($1)
      RETURNING *;
    `;

    try {
        const result = await client.query(query, [customerName.trim()]);
        console.log(`Customer ${customerName} added successfully!`);
        return result.rows[0];
    } catch (error) {
        console.error('Failed to add customer:', error.stack);
        throw new Error('Could not add customer to the database.');
    }
};

export const handleGetAllCustomers = async () => {
    try {
        if (!client) throw new Error('Database client is not connected');

        const query = await client.query('SELECT * FROM customers');
        return query.rows;
    } catch (error) {
        throw new Error('Error getting customers from the database!');
    }
}