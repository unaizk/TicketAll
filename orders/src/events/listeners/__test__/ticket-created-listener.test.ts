import { TicketCreatedEvent } from "@unaiztickets/common"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketCreatedListener } from "../ticket-created listener"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"



const setup = async() =>{
    //Create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client)


    //Create a fake data event
    const data : TicketCreatedEvent['data'] = {
        id : new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 900,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version : 0
    }


    // Create a fake message object
    //@ts-ignore
    const msg : Message = {
        ack: jest.fn()
    }

    return {listener,data,msg}
}


it('Creates and saves a ticket',async() =>{

    const { listener, data , msg} = await setup()
    //Calls onMessage function with data object + message object
      await listener.onMessage(data,msg)
    //Write a assertion to make sure a ticket was created
    const ticket = await Ticket.findById(data.id)

    expect(ticket).toBeDefined()
    expect(ticket!.title).toEqual(data.title)
    expect(ticket!.price).toEqual(data.price)
})

it('Acks the message',async() =>{
    const {listener , data, msg} = await setup()
     //Calls onMessage function with data object + message object
    await  listener.onMessage(data,msg)
     //Write a assertion to make sure ack function is called
     expect(msg.ack).toHaveBeenCalled()
})