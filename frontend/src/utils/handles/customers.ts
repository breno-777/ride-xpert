export const handleGetAllCustomers = async () => {
    try {
        const response = await fetch('http://localhost:8080/customer/all');
        if (!response.ok) {
            throw new Error(`Failed to get all customers: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Could not get all customers!', error);
        throw error;
    }
}

export const handleAddCustomer = async (
    name: string,
    addNotification: (type: string, error: string, message: string) => void
) => {
    try {
        const response = await fetch('http://localhost:8080/customer/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        });

        if (!response.ok) {
            const error = await response.json();
            addNotification('error', error.error_core, error.error_description || "Unknown Error.");
        }

        const data = await response.json();

        if (response.ok) {
            addNotification('success', 'CUSTOMER_SUCCESSFULLY_ADDED', `Welcome ${data.customer.name}, thank you for choosing us`);
        }

        return data.customer;
    } catch (error) {
        console.error('Could not add customer!', error);
        throw error;
    }
};
export const handleGetCustomerHistory = async (
    customer_id: number,
    driver_id: number | null,
    addNotification: (type: string, error: string, message: string) => void
) => {
    try {
        let url = `http://localhost:8080/ride/${customer_id}`;
        if (driver_id !== null) {
            url += `?driver_id=${driver_id}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            const error = await response.json();
            addNotification('error', error.error_code, error.error_description || "Unknown Error.");
            return [];
        }

        const data = await response.json();
        return data.rides || [];

    } catch (error) {
        console.error('Could not get customer history!', error);
        addNotification('error', 'SERVER_ERROR', 'An error occurred while fetching the data.');
        return [];
    }
};
