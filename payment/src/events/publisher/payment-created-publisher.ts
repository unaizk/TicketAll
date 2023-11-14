import { PaymentCreatedEvent, Publisher, Subjects } from "@unaiztickets/common";


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject : Subjects.PaymentCreated = Subjects.PaymentCreated
}