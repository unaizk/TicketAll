import { Publisher, Subjects, TicketCreatedEvent } from "@unaiztickets/common";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject : Subjects.TicketCreated = Subjects.TicketCreated
}