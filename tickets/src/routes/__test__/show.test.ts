
import { app } from "../../app";
import request from "supertest";
import mongoose from 'mongoose'


it('Return a 404 if the tickets is not found',async()=>{
   
    const id = new mongoose.Types.ObjectId().toHexString() // It will generate a duplicate id for testing purpose
    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404)
})


it('Return a ticket if the tickets is found',async()=>{
    const cookie = global.signin()//retrun a cookie string
    const title = 'Premier league'
    const price = 500;

    const response = await request(app)
            .post('/api/tickets')
            .set('Cookie',cookie)
            .send({title,price})
            .expect(201)

     const ticketResponse = await request(app)
            .get(`/api/tickets/${response.body.id}`)
            .send()
            .expect(200)

            expect(ticketResponse.body.title).toEqual(title)
            expect(ticketResponse.body.price).toEqual(price)

})