import mongoose from "mongoose";
import { Order } from "../../../model/order";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { OrderCancelledEvent, OrderStatus } from "@unaiztickets/common";


const setup = async()=>{
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id : new mongoose.Types.ObjectId().toHexString(),
        userId : '123456789',
        version : 0,
        price : 400,
        status : OrderStatus.Created
    })

    await order.save();


    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: '123456789',
        }
    }

    //@ts-ignore
    const msg : Message = {
        ack : jest.fn()
    }

    return { listener, data, msg, order}
}


it('Updates the status of the order', async() =>{
    const { listener, data, msg, order} = await setup()

    await listener.onMessage(data,msg)

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
})

it('acks the message', async() =>{
    const { listener, data, msg, order} = await setup()

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();
})