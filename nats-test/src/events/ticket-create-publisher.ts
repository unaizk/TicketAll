import { Publisher } from "./base-publisher";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticker-create-event";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject:Subjects.TicketCreated = Subjects.TicketCreated

}