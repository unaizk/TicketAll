import { app } from "../../app";
import request from "supertest";

it('Return a 201 on succesfull signup',async()=>{
   
   
    return request(app)
        .post('/api/users/signup')
        .send({
            email:'unaisk@gmail.com',
            password:"1234"
        })

        .expect(201);
})