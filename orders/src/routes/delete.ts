import { requireAuth, NotFoundError, NotAuthorizedError, OrderStatus } from '@unaiztickets/common';
import express ,{Request,Response} from 'express'
import { Order } from '../models/orders';


const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async(req : Request, res : Response)=>{

    const orderId = req.params.orderId

    const order = await Order.findById(orderId)

    if(!order){
        throw new NotFoundError()
    }
    if(order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError()
    }

    order.status = OrderStatus.Cancelled

    res.status(204).send(order)
})

export {router as deleteOrdersRouter}