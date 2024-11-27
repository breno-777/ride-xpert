import { IDriver } from "@/interfaces/driver.interface";

export async function handleEstimateRide(
    customer_id: number,
    origin: string,
    destination: string,
    addNotification: (type: string, error: string, message: string) => void
) {
    try {
        const response = await fetch('http://localhost:8080/ride/estimate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customer_id,
                origin,
                destination
            })
        });

        if (!response.ok) {
            const error = await response.json();
            addNotification('error', error.error_core, error.error_description || "Unknown Error.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error: ${error}`);
    }
}

export async function handleConfirmRide(
    constumer_id: number,
    origin: string,
    destination: string,
    distance: number,
    duration: number,
    driver: IDriver,
    addNotification: (type: string, error: string, message: string) => void
) {
    try {
        const response = await fetch('http://localhost:8080/ride/confirm', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customer_id: constumer_id,
                origin,
                destination,
                distance,
                duration,
                driver
            })
        });

        if (!response.ok) {
            const error = await response.json();
            addNotification('error', error.error_core, error.error_description || "Unknown Error.");
        }
        if (response.ok) {
            addNotification('success', 'RIDE_SUCCESSFULLY_COMPLETED', 'Thank you for choosing us');
        }
        
    } catch (error) {
        throw new Error(`Error: ${error}`);
    }
}
