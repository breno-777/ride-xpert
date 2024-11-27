import { ErrorName } from "../types/errors";

export class ProjectError extends Error {
    name: ErrorName;
    message: string;
    cause: any;

    constructor({
        name,
        message,
        cause
    }: {
        name: ErrorName;
        message: string;
        cause?: any;
    }) {
        super();
        this.name = name;
        this.message = message;
        this.cause = cause;
    }
};