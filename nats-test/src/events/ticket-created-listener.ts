import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-create-event";
import { Subjects } from "./subjects";


export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject:Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payment-services';

    onMessage(data:TicketCreatedEvent['data'], msg:Message){
        console.log('Event data', data);
        
        msg.ack()
    }   
  }