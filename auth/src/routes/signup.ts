import express,{Request , Response} from 'express';
import {body,validationResult} from 'express-validator'

import jwt from 'jsonwebtoken'
import { User } from '../models/user';
import { BadRequestError , validateRequest } from '@unaiztickets/common';


const router = express.Router();

router.post('/api/users/signup',[
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min:4 , max:20})
        .withMessage('Password must be within 4 or 20 characters')
],
validateRequest
,
async(req : Request,res : Response)=>{

    const {email,password} = req.body;

   const existingUser = await User.findOne({email});

   if(existingUser){
    throw new BadRequestError('Email in use')
   }

   const user = User.build({
    email,password
   })

   await user.save()

   //Genrate JWT 
   const userJwt = jwt.sign({
    id:user._id,
    email:user.email
   },process.env.JWT_KEY!)//secret key

   //Store it on session object

   req.session = {
    jwt:userJwt  
   }

   res.status(201).send(user)


    
    
    
})

export {router as signupRouter}