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


it('Return a 400 on Invalid email',async()=>{
   
    return request(app)
        .post('/api/users/signup')
        .send({
            email:'unaiskgmail.com',
            password:"1234"
        })

        .expect(400);
})

it('Return a 400 on Invalid password',async()=>{
   
    return request(app)
        .post('/api/users/signup')
        .send({
            email:'unaisk@gmail.com',
            password:"1"
        })

        .expect(400);
})


it('Return a 400 on empty password and email',async()=>{

    await request(app)
        .post('/api/users/signup')
        .send({
        
            password:"1234"
        })

        .expect(400);

    await request(app)
    .post('/api/users/signup')
    .send({
        email:'unaisk@gmail.com',
      
    })

    .expect(400);
})


it('Email already exisiting error',async()=>{

    await request(app)
        .post('/api/users/signup')
        .send({
            email:'unaisk@gmail.com',
            password:"1234"
        })

        .expect(201);

    await request(app)
    .post('/api/users/signup')
    .send({
        email:'unaisk@gmail.com',
        password:"1234"
    })

    .expect(400);
})


it('Set cookie after succesfull signup',async()=>{
   
    const cookie = await global.signup() // In the setup.ts file, I've exported a signup() function globally.
    expect(cookie).toBeDefined()
})