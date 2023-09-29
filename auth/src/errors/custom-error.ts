export abstract class CustomError extends Error {
    abstract statusCode : number;

    constructor(message:string){
        super(message)

         //Only beacuase we are extending a built in class
         Object.setPrototypeOf(this, CustomError.prototype)
    }

    abstract serialize(): {message: string , field?: string}[]
}