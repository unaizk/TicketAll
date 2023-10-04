import { app } from "../../app";
import request from "supertest";


it('Entered email that does not exist',async()=>{
    await request(app)
     .post('/api/users/signin')
     .send({
        email:'unaizk@gmail.com',
        password:'1234'
     })
    .expect(400)
})

it('Invalid password',async()=>{
    await request(app)
     .post('/api/users/signup')
     .send({
        email:'unaizk@gmail.com',
        password:'1234'
     })
    .expect(201)

    await request(app)
     .post('/api/users/signin')
     .send({
        email:'unaizk@gmail.com',
        password:'123456789'
     })
    .expect(400)
})


it('Set cookie after succesfull signin',async()=>{
   
    await request(app)
        .post('/api/users/signup')
        .send({
        email:'unaizk@gmail.com',
        password:'1234'
        })
        .expect(201)

    const response = await request(app)
        .post('/api/users/signin')
        .send({
        email:'unaizk@gmail.com',
        password:'1234'
        })
        .expect(200)

    expect(response.get('Set-Cookie')).toBeDefined()    
})