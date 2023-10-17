import { Listener, OrderCreatedEvent, Subjects } from "@unaiztickets/common";
import { queueGroupName } from "./queue-grouop-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";


export class orderCreatedListener extends Listener<OrderCreatedEvent>{
    subject : Subjects.OrderCreated = Subjects.OrderCreated;

    queueGroupName: string = queueGroupName;

    async onMessage(data:OrderCreatedEvent['data'], msg: Message){
        // Find the ticket the order is reserving
        const ticket = await Ticket.findById(data.ticket.id)
        //If no ticket throw error
        if(!ticket){
            throw new Error('Ticket not found')
        }
        //Mark the ticket as being reserved by setting its orderId
        ticket.set({orderId : data.id})
        //Save the ticket 
        await ticket.save()

        //Publish the event when updated the ticket by adding orderId
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title : ticket.title,
            price : ticket.price,
            userId : ticket.userId,
            version : ticket.version,
            orderId : ticket.orderId
        })
        // Ack the message
        msg.ack()
    }
}