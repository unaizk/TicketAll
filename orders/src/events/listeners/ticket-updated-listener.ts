import { Listener, Subjects, TicketUpdatedEvent } from "@unaiztickets/common"
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";



export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;
  
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
       
        try {
            const ticket = await Ticket.findByEvent(data); // this method is written in ticket.ts inside model folder

         
            if (!ticket) {
                console.log('Ticket not found');
            } else {
                const { title, price } = data;
                ticket.set({ title, price });
                await ticket.save();
            }
            
    
            msg.ack();
        } catch (error) {
            console.error(error);
        }
    }
    
  }