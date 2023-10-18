import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { ExpirationCompleteListener } from "../expiration-complete-listener"
import { Order } from "../../../models/orders";
import { ExpirationCompleteEvent, OrderStatus } from "@unaiztickets/common";


const setup = async() =>{
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id : new mongoose.Types.ObjectId().toHexString(),
        title : "Concert",
        price : 500
    })

    await ticket.save();

    const order = Order.build({
        status : OrderStatus.Created,
        userId : '123456789',
        expiresAt : new Date(),
        ticket : ticket
    })

    await order.save();

    const data : ExpirationCompleteEvent['data'] = {
        orderId : order.id
    }

    //@ts-ignore
    const msg : Message ={
        ack : jest.fn()
    }

    return { listener, ticket, order, data, msg}
}

it('Update the order status to cancelled', async()=>{
    const { data, msg, listener, order} = await setup();

    await listener.onMessage(data,msg)

    const updatedOrder = await Order.findById(order.id);

   expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it(' Emit an order cancelled event', async()=>{
    const { data, msg, listener, order} = await setup();

    await listener.onMessage(data,msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

    expect(eventData.id).toEqual(order.id)
})

it(' ack the message', async()=>{
     const { data, msg, listener} = await setup();

    await listener.onMessage(data,msg)

    expect(msg.ack).toHaveBeenCalled()
})