import { Listener, OrderCreatedEvent, Subjects } from "@unaiztickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queues";


export class orderCreatedListeners extends Listener<OrderCreatedEvent>{
    subject : Subjects.OrderCreated = Subjects.OrderCreated;

    queueGroupName: string = queueGroupName;

    async onMessage(data : OrderCreatedEvent['data'], msg : Message){
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
        console.log('Waiting to millisecond to process the job',delay);
        
        await expirationQueue.add({
            orderId : data.id
        },{
            delay
        })
        msg.ack()
    }

   
}