export interface IDriver {
    id?: number
    name: string;
    description: string;
    review?: { rating: number, comment: string };
    vehicle: string;
    tax: number;
    minimum_km: number;
}