import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../model/order';
import { OrderStatus } from '@unaiztickets/common';
import { stripe } from '../../stripe';


jest.mock('../../stripe')

it('return 404 when purchasing an order that does not exist',async() =>{

    await request(app)
        .post('/api/payment')
        .set('Cookie',global.signin())
        .send({
            token : '123456789',
            orderId :new mongoose.Types.ObjectId().toHexString()
        })
        .expect(404)

})

it('return 401 when purchasing an order that does not belongs to the user',async() =>{

    const order = Order.build({
        id : new mongoose.Types.ObjectId().toHexString(),
        userId : new mongoose.Types.ObjectId().toHexString(),
        version : 0,
        price : 500,
        status : OrderStatus.Created
    })

    await order.save();

    await request(app)
    .post('/api/payment')
    .set('Cookie',global.signin())
    .send({
        token : '123456789',
        orderId : order.id
    })
    .expect(401)

})

it('return 400 when purchasing an cancelled order ',async() =>{
    const userId = new mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
        id : new mongoose.Types.ObjectId().toHexString(),
        userId : userId,
        version : 0,
        price : 500,
        status : OrderStatus.Cancelled
    })

    await order.save();

    const payment = await request(app)
        .post('/api/payment')
        .set('Cookie',global.signin(userId))
        .send({
            token : '123456789',
            orderId : order.id
        })
        .expect(400)

    
})

it('return 204 with a valid inputs',async()=>{
    const userId = new mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
        id : new mongoose.Types.ObjectId().toHexString(),
        userId : userId,
        version : 0,
        price : 500,
        status : OrderStatus.Cancelled
    })

    await order.save();

    await request(app)
        .post('/api/payment')
        .set('Cookie',global.signin(userId))
        .send({
            token : 'tok_visa',
            orderId : order.id
        })
        .expect(201)

        const chargeOption = (stripe.charges.create as jest.Mock).mock.calls[0][0]

        expect(chargeOption.source).toEqual('tok_visa')
        expect(chargeOption.currency).toEqual('inr')
        expect(chargeOption.price).toEqual(500*100)
})

