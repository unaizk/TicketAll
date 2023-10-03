import mongoose from "mongoose"
import {app} from './app'



const start = async() =>{

    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY is invalid')
    }
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


