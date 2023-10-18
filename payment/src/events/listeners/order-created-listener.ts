import { Listener, OrderCreatedEvent, Subjects } from "@unaiztickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/order";


export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject : Subjects.OrderCreated = Subjects.OrderCreated;

    queueGroupName: string = queueGroupName;

    async onMessage(data : OrderCreatedEvent['data'], msg : Message){
        const order = Order.build({
            id : data.id,
            userId : data.userId,
            version : data.version,
            status : data.status,
            price : data.ticket.price
        })

        await order.save();

        msg.ack();
    }
}