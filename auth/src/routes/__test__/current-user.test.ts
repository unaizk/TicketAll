import { app } from "../../app";
import request from "supertest";

it('Respond with the details about the current user',async()=>{
   
    const authResponse = await request(app)
        .post('/api/users/signup')
        .send({
            email:'unaizk@gmail.com',
            password:"1234"
        })

        .expect(201);

        const cookie = authResponse.get('Set-Cookie')


    const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie',cookie)
    .send()
    .expect(200);

    expect(response.body.currentUser.email).toEqual('unaizk@gmail.com')   
})