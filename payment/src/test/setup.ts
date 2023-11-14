import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'
import request from 'supertest'
import jwt from 'jsonwebtoken'

//To make the signin function available globally and accessible everywhere in the testing environment,
declare global {
    var signin: (id?: string) => string[];
  }
  

jest.mock('../nats-wrapper')
let mongo:any

process.env.STRIPE_KEY = 'sk_test_51O3ZzgSIhnRYEa3poLtS6QiFAt83Y5faxDfrLUIE1mOkZHc7LfuOltP6vIDYO0xKzQ9FlQ8tXQtOytHz763USUTT00Ks2O2rCs'  // exposing stripe secret key for tesing payment in realistic without mocking because stripe i set env in kubernetes cluster its not available in locally thats why i exposed here

beforeAll(async()=>{
   
    process.env.JWT_KEY = 'unais'
  
    
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
})

beforeEach(async()=>{
    jest.clearAllMocks();
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


global.signin = (id?: string)=>{
   // Build a dummy JWT payload { id , email}

   const payload = {
    id:id || new mongoose.Types.ObjectId().toHexString(),// generating userId so in each call it will create new userId randomly
    email:'unaiz@gmail.com'
   }

   //Create the JWT
   const token = jwt.sign(payload,process.env.JWT_KEY!)

   //Build session Object. {jwt: MY_JWT}
   const session = { jwt : token }

   //Turn that session into json
   const sessionJson = JSON.stringify(session);

   // Take JSON and encode into base64
   const base64 = Buffer.from(sessionJson).toString('base64')

   // return a string that cookie with ecoded data
   return [`session=${base64}`]
}