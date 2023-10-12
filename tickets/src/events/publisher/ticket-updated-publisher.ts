import { Publisher, Subjects, TicketUpdatedEvent } from "@unaiztickets/common";


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject : Subjects.TicketUpdated = Subjects.TicketUpdated
}