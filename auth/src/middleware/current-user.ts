import { Request , Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

interface UserPayload {
    email : string,
    id : string
}

//Setting currentUser field on request object
declare global{
    namespace Express {
        interface Request {
            currentUser?:UserPayload
        }
    }
}

export const currentUser = (req : Request, res : Response, next : NextFunction) =>{
    if(!req.session?.jwt){
        return next()
     }
     try {
         const payload = jwt.verify(req.session.jwt , process.env.JWT_KEY!) as UserPayload;
         req.currentUser = payload
     } catch (error) {};

     next();
}