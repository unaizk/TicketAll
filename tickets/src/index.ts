import mongoose from "mongoose"
import {app} from './app'



const start = async() =>{

    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY is invalid')
    }
    if(!process.env.MONGO_URI){
        throw new Error('MONGO_URI must be defined')
    }
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB');
        
    } catch (error) {
        console.error(error)
    }

    app.listen(3000,()=>{
        console.log('auth listening on port 3000');
        
    })
}  

start();


