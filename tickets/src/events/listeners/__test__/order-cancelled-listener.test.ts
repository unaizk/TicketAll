import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { OrderCancelledEvent } from "@unaiztickets/common";
import { Message } from "node-nats-streaming";


const setup = async()=>{

    const listener = new OrderCancelledListener(natsWrapper.client);


    const orderId = new mongoose.Types.ObjectId().toHexString()
    const ticket = Ticket.build({
        title : "Concert",
        price : 500,
        userId : new mongoose.Types.ObjectId().toHexString()
    })

    ticket.set({orderId:orderId})

    await ticket.save();

    const data : OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
        }
    }
    //@ts-ignore
    const msg : Message = {
        ack : jest.fn()
    }

    return {orderId,ticket,listener,data,msg}
}

it('Updates the tiket, Publishes an event and acks the message',async()=>{
    const {orderId,ticket,listener,data,msg} = await setup();

    await listener.onMessage(data,msg)

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toBeUndefined()

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    expect(msg.ack).toHaveBeenCalled();
})