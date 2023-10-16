import { requireAuth, NotFoundError, NotAuthorizedError, OrderStatus } from '@unaiztickets/common';
import express ,{Request,Response} from 'express'
import { Order } from '../models/orders';
import { OrderCancelledPublisher } from '../events/publisher/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';


const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async(req : Request, res : Response)=>{

    const orderId = req.params.orderId

    const order = await Order.findById(orderId).populate('ticket')

   
    

    if(!order){
        throw new NotFoundError()
    }
    if(order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError()
    }

    order.status = OrderStatus.Cancelled
    
    await order.save();

     //Publish an event saying that an order was created

     await new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version : order.version,
        ticket : {
            id : order.ticket.id
        }
     })


    res.status(204).send(order)
})

export {router as deleteOrdersRouter}