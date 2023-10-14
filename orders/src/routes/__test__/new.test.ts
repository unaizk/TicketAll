import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/orders';
import { OrderStatus } from '@unaiztickets/common';



it('Return an error if the ticket does not exist',async()=>{
    const ticketId = new mongoose.Types.ObjectId()
    await request(app)
        .post('/api/orders')
        .set('Cookie',global.signin())
        .send({ticketId})
        .expect(404)
})


it('Return an error if the ticket is already reserved',async()=>{
    const ticket = Ticket.build({
        title:'COncert',
        price:500
    })
     await ticket.save()

    const order = Order.build({
        ticket : ticket.id,
        userId : '123456789',
        status : OrderStatus.Created,
        expiresAt : new Date()
    })

    await order.save()

    await request(app)
        .post('/api/orders')
        .set('Cookie',global.signin())
        .send({
            ticketId : ticket.id
        })
        .expect(400)
})


it('Reserve a ticket',async()=>{
    const ticket = Ticket.build({
        title:'COncert',
        price:500
    })
     await ticket.save()

     await request(app)
     .post('/api/orders')
     .set('Cookie',global.signin())
     .send({
         ticketId : ticket.id
     })
     .expect(201)
})