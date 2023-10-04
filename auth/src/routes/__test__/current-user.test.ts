import { app } from "../../app";
import request from "supertest";

it('Respond with the details about the current user if user is authenticated',async()=>{

    const cookie = await global.signup()// In the setup.ts file, I've exported a signup() function globally.

    const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie',cookie)
    .send()
    .expect(200);

    expect(response.body.currentUser.email).toEqual('unaizk@gmail.com')   
})

it('Respond with null if not authenticated',async()=>{

    const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(401);

     
})