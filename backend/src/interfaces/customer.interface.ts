import { IDriver } from "./driver.interface";

export interface ICustomer {
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