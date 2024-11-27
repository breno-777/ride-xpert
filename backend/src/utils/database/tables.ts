import { client } from "./db";

export const createCustomersTable = async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        history JSONB DEFAULT '[]'
      );
    `;

    try {
        console.log('Creating customers table...');
        await client.query(query);

        const checkTableQuery = `SELECT * FROM information_schema.tables WHERE table_name = 'customers';`;
        const result = await client.query(checkTableQuery);

        if (result.rows.length > 0) {
            console.log('Customers table created successfully!');
        } else {
            console.log('Customers table creation failed!');
        }

    } catch (error) {
        console.error('Error creating customer table:', error.stack);
    }
}

export const createDriversTable = async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS drivers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        vehicle VARCHAR(255) NOT NULL,
        review JSONB,
        tax DECIMAL(10, 2),
        minimum_km INT NOT NULL
      );
    `;

    try {
        console.log('Creating drivers table...');
        await client.query(query);

        const checkTableQuery = `SELECT * FROM information_schema.tables WHERE table_name = 'drivers';`;
        const result = await client.query(checkTableQuery);

        if (result.rows.length > 0) {
            console.log('Drivers table created successfully!');
        } else {
            console.log('Drivers table creation failed!');
        }

    } catch (error) {
        console.error('Error creating drivers table:', error.stack);
    }
}