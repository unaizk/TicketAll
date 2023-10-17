import mongoose from "mongoose"
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedListener } from "../ticket-updated-listener"
import { TicketUpdatedEvent } from "@unaiztickets/common"
import { Message } from "node-nats-streaming"


const setup = async() =>{
    // Create a listener
     const listener = new TicketUpdatedListener(natsWrapper.client)
    //Create and save ticket
    const ticket = Ticket.build({
        id : new mongoose.Types.ObjectId().toHexString(),
        title : "concert",
        price : 500

    }) 

    await ticket.save()
    //Create a fake data object

    const data : TicketUpdatedEvent['data'] = {
        id: ticket.id,
        title: "Football",
        price: 600,
        userId: '123456789',
        version: ticket.version + 1,
    }

    //Create a fake msg object
    //@ts-ignore
    const msg : Message= {
        ack : jest.fn()
    }

    // Return all this stuff

    return {listener, data, msg, ticket}
}


it('Finds updates and save the ticket',async() =>{
    const {listener, data, msg , ticket} = await setup()


   await listener.onMessage(data,msg)    

   const updatedTicket = await Ticket.findById(ticket.id)

   expect(updatedTicket!.id).toEqual(data.id)
   expect(updatedTicket!.title).toEqual(data.title)
   expect(updatedTicket!.price).toEqual(data.price)
   expect(updatedTicket!.version).toEqual(data.version)


})

it('acks the message',async() =>{
    const {listener, data, msg , ticket} = await setup()

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled()
})

it('does not call acks if the event has a skipped version number',async() =>{
    const {listener, data, msg , ticket} = await setup()

    data.version = 10;

    try {
        await listener.onMessage(data,msg)
    } catch (error) {}

    expect(msg.ack).not.toHaveBeenCalled()
})