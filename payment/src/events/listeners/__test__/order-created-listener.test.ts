import { OrderCreatedEvent, OrderStatus } from "@unaiztickets/common";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListenerPayment } from "../order-created-listener"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../model/order";


const setup = async()=>{
     const listener = new OrderCreatedListenerPayment(natsWrapper.client);

     const data : OrderCreatedEvent['data'] = {
        id : new mongoose.Types.ObjectId().toHexString(),
        userId: '123456789',
        status: OrderStatus.Created,
        expiresAt: '10-03-2023',
        version: 0,
        ticket: {
            id: '789456123',
            price: 200,
        }
     }

     //@ts-ignore
     const msg : Message = {
        ack : jest.fn()
     }

     return { listener, data, msg}
     
}

it('Replicate the order info',async()=>{
    const { listener, data, msg} = await setup()

    await listener.onMessage(data,msg);

    const order = await Order.findById(data.id);

    expect(order!.price).toEqual(data.ticket.price)
})

it('acks the message',async()=>{
    const { listener, data, msg} = await setup()

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();
})