import mongoose from "mongoose"
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { orderCreatedListener } from "../order-created-listener"
import { OrderCreatedEvent, OrderStatus } from "@unaiztickets/common"
import { Message } from "node-nats-streaming"

const setup = async()=>{
    // Create an instance of listener
    const listener = new orderCreatedListener(natsWrapper.client)
    //Create and save a ticket
    const ticket = Ticket.build({
        title: 'Concert',
        price : 500,
        userId : new mongoose.Types.ObjectId().toHexString()

    })
    await ticket.save()
    //Create the fake data event
    const data : OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString() ,
        userId: '123456789',
        status: OrderStatus.Created,
        expiresAt: '10-03-2024',
        version: 0,
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    }
    //Create a fake message
    //@ts-ignore
    const msg : Message = {
        ack: jest.fn()
    }

    return { ticket, msg, listener, data}
}

it('Sets the userId for the ticket',async()=>{
    const { ticket, msg, listener, data} = await setup()

    await listener.onMessage(data,msg)

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id)
})

it('Acks the message',async()=>{
    const { ticket, msg, listener, data} = await setup()

    await listener.onMessage(data,msg)

    expect(msg.ack).toHaveBeenCalled()
})