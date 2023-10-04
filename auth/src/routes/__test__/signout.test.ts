import { app } from "../../app";
import request from 'supertest'


it('Clear the cookie after signout',async()=>{
    await request(app)
        .post('/api/users/signup')
        .send({
            email:'unaizk@gmail.com',
            password:'1234'
        })
        .expect(201)

    const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200)

    expect(response.get('Set-Cookie')[0]).toEqual('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly')
    
})