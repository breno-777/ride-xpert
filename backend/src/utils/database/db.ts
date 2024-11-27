import { Client } from "pg";
import { createCustomersTable, createDriversTable } from "./tables";

export const client = new Client({
    host: process.env.DB_HOST || 'postgres',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'docker',
    password: process.env.DB_PASSWORD || 'docker',
    database: process.env.DB_NAME || 'ridexpert',
});

export const connectDatabase = async (retries = 20, delay = 5000) => {
    while (retries > 0) {
        try {
            console.log('Connecting to database...');
            await client.connect();
            console.log('Connected to the database successfully!');
            await createCustomersTable();
            await createDriversTable();
            break;
        } catch (error) {
            retries -= 1;
            console.error(
                `Failed to connect to the database. Retries left: ${retries}`
            );
            console.error(error.stack);
            if (retries === 0) {
                console.error('Exhausted retries. Exiting...');
                process.exit(1);
            }
            console.log(`Retrying connection in ${delay / 1000} seconds...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
};
