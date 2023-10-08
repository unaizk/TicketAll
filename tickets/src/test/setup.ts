import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'
import request from 'supertest'

//To make the signup function available globally and accessible everywhere in the testing environment,
declare global {
    var signup: () => Promise<string[]>;  // cookie return a promise with the type string of array 
}

let mongo:any

beforeAll(async()=>{
   
    process.env.JWT_KEY = 'unais'
  
    
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
})

beforeEach(async()=>{
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections ){
        await collection.deleteMany({})
    }
})

afterAll(async()=>{
    if (mongo) {
        await mongo.stop();
      }
    await mongoose.connection.close();
})


global.signup = async()=>{
    const email = "unaizk@gmail.com";
    const password = '1234'

    const response = await request(app)
        .post('/api/users/signup')
        .send({email,password})
        .expect(201);

    const cookie = response.get('Set-Cookie')  
    return cookie  
}