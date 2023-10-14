import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';



it('Return an error if the ticket does not exist',async()=>{
    const ticketId = new mongoose.Types.ObjectId()
    await request(app)
        .post('/api/orders')
        .set('Cookie',global.signin())
        .send({ticketId})
        .expect(404)
})


it('Return an error if the ticket is already reserved',async()=>{

})


it('Reserve a ticket',async()=>{
    
})