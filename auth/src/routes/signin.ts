import express,{Request,Response} from 'express';
import jwt from 'jsonwebtoken'
import {body,validationResult} from 'express-validator'

import { validateRequest , BadRequestError } from '@unaiztickets/common';
import { User } from '../models/user';

import { Password } from '../services/password';

const router = express.Router();

router.post('/api/users/signin',
[
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage("You must supply password")    

],
validateRequest
,
async(req:Request,res:Response)=>{
    const {email,password} = req.body;

    const existingUser = await User.findOne({email});

    if(!existingUser){
        throw new BadRequestError('Invalid credentials');
    }

    const passwordMatch = await Password.compare(existingUser.password,password)

    if(!passwordMatch){
        throw new BadRequestError('Inavlid credentials')
    }

    //Generate jwt

    const userJwt = jwt.sign({
        id:existingUser.id,
        email:existingUser.email
    },process.env.JWT_KEY!)//secret key

    //Store it on session object

    req.session = {
        jwt: userJwt
    }

    res.status(200).send(existingUser)

})

export {router as signinRouter}