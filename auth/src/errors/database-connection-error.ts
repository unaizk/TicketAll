import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError{
    reason = 'Database conntection error'
    statusCode = 500
    constructor(){
        super("Error connecting to db")

        Object.setPrototypeOf(this,DatabaseConnectionError.prototype)
    }

    serialize(){
        return [
            {message: this.reason}
        ]
    }
}