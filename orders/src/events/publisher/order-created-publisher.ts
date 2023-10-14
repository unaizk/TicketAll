import { Publisher, OrderCreatedEvent, Subjects } from "@unaiztickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject : Subjects.OrderCreated = Subjects.OrderCreated
}