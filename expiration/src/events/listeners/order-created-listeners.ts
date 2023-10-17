import { Listener, OrderCreatedEvent, Subjects } from "@unaiztickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queues";


export class orderCreatedListeners extends Listener<OrderCreatedEvent>{
    subject : Subjects.OrderCreated = Subjects.OrderCreated;

    queueGroupName: string = queueGroupName;

    async onMessage(data : OrderCreatedEvent['data'], msg : Message){
        await expirationQueue.add({
            orderId : data.id
        })
        msg.ack()
    }

   
}