import { Listener, Subjects, TicketUpdatedEvent } from "@unaiztickets/common"
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";



export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;
  
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        console.log(data, 'data');
        console.log(data.id,data.title);
        
    
        try {
            const ticket = await Ticket.findOne({
                _id: data.id,
                version: data.version - 1,
            });

            console.log(ticket,'ticket');
            
    
            if (!ticket) {
                console.log('Ticket not found');
            } else {
                const { title, price } = data;
                ticket.set({ title, price });
                await ticket.save();
            }
            console.log(ticket, 'after saving ticket');
            
    
            msg.ack();
        } catch (error) {
            console.error(error);
        }
    }
    
  }