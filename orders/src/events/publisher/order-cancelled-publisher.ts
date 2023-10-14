import { Publisher, OrderCancelledEvent, Subjects } from "@unaiztickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject : Subjects.OrderCancelled = Subjects.OrderCancelled
}