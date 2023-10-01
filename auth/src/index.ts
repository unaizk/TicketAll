import express from 'express';
import 'express-async-errors'
import mongoose from "mongoose"
import cookieSession from 'cookie-session';
import { json } from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { errorHandler } from './middleware/error-handler';
import { NotFoundError } from './errors/not-found-error';



const app = express();
app.set('trust proxy', true)

app.use(json());
app.use(cookieSession({
    signed:false,
    secure:true
}))
app.use(currentUserRouter)
app.use(signinRouter)
app.use(signupRouter)
app.use(signoutRouter)

app.all('*',async()=>{
    throw new NotFoundError()
})

app.use(errorHandler)

const start = async() =>{
    try {
        await mongoose.connect('mongodb://mongo-srv:27017/auth')
        console.log('Connected to MongoDB');
        
    } catch (error) {
        console.error(error)
    }

    app.listen(3000,()=>{
        console.log('auth listening on port 3000');
        
    })
}  

start();


