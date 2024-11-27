import { IDriver } from "./driver.interface";

export interface ICustomer {
    id: number;
    name: string;
    history: ICustomerHistory[];
}

export interface ICustomerHistory {
    date: Date;
    driver: IDriver;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    value: number;
}