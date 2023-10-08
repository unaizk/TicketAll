import request from 'supertest';
import { app } from '../../app';


it('has a route handler listening to /api/tickets for post request',async()=>{
    const response = await request(app)
            .post('/api/tickets')
            .send({})
        expect(response.status).not.toEqual(404)
})

it('can only be accessed if user is signed in',async()=>{
    const response = await request(app)
                .post('/api/tickets')
                .send({})
                .expect(401)

})

it('Return a status other than 401 if the user is signed in',async()=>{
    const cookie = global.signin()//retrun a cookie string
    const response = await request(app)
                .post('/api/tickets')
                .set('Cookie',cookie)
                .send({})
                

            expect(response.status).not.toEqual(401)

})

it('Return an error if an invalid title is provided',async()=>{

})

it('Retun an error if an invalid price is provided ',async()=>{

})

it('create a tickets with valid inputs',async()=>{

})