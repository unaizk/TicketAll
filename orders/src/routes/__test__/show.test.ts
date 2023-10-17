import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

it('Fetches order by a particular orderId',async()=>{
     //create a ticket 

     const ticket = Ticket.build({
         id : new mongoose.Types.ObjectId().toHexString(),
        title : 'Concert',
        price : 500
     })

     await ticket.save()

     // Create an order with this ticket
     const user = global.signin()
     const { body:order} = await request(app)
            .post('/api/orders')
            .set('Cookie',user)
            .send({ticketId : ticket.id})
            .expect(201)

    //Make request to fetch order 
     const { body:fetchOrder} = await request(app)
            .get(`/api/orders/${order.id}`)
            .set('Cookie',user)
            .expect(200)

            expect(fetchOrder.id).toEqual(order.id)
})



it('Return error if one user try to fetch another user order ',async()=>{
    //create a ticket 

    const ticket = Ticket.build({
       id : new mongoose.Types.ObjectId().toHexString(),
       title : 'Concert',
       price : 500
    })

    await ticket.save()

    // Create an order with this ticket
    const user = global.signin()
    const { body:order} = await request(app)
           .post('/api/orders')
           .set('Cookie',user)
           .send({ticketId : ticket.id})
           .expect(201)
    
   //Make request to fetch order 
    await request(app)
           .get(`/api/orders/${order.id}`)
           .set('Cookie',global.signin())//new user
           .expect(401)
})