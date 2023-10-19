import { Listener, OrderCreatedEvent, Subjects } from "@unaiztickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/order";

export class OrderCreatedListenerPayment extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
  
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
      console.log('Received Order Created Event', data);

      const order = Order.build({
        id: data.id,
        price: data.ticket.price,
        status: data.status,
        userId: data.userId,
        version: data.version,
      });
      await order.save();
  
      msg.ack();
    }
}
