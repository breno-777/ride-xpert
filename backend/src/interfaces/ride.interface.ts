import { IDriver } from "./driver.interface";

export interface IRide {
    costumer_id: number;
    date: Date;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    diver: {
        id: number;
        name: string;
    };
    value: number;
}

interface ICoordinates {
    latitude: number;
    longitude: number;
}
export interface IRideReqBody {
    customer_id: number;
    origin: string;
    destination: string;
}

export interface IConfirmRideReqBody {
    customer_id: number;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    driver: IDriver;
    value: number;
}