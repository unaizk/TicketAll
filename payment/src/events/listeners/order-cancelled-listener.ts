import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@unaiztickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/order";



export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // Find the Order that's cancelled
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    // If no order exists, throw an error
    if (!order) {
      throw new Error("Order not found !!!");
    }

    // If order exist, mark the status of order as cancelled.
    order.set({ status: OrderStatus.Cancelled });

    // Save the Ticket to DB
    await order.save();

    // Acknowledge the event
    msg.ack();
  }
}