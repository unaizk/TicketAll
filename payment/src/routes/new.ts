import { BadRequestError, NotAuthorizedError, OrderStatus, requireAuth, validateRequest } from '@unaiztickets/common';
import express , {Request, Response} from 'express'
import { body } from 'express-validator';
import { Order } from '../model/order';

const router = express.Router();

router.post('/api/payment', requireAuth, [
    body('token')
    .not()
    .isEmpty(),

    body('orderId')
    .not()
    .isEmpty()
],validateRequest, async(req : Request, res : Response)=>{

    const {token , orderId} = req.body.id;

    const order = await Order.findById(orderId);

    if(!order){
        throw new Error('Order not found')
    }

    if(order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError()
    }

    if(order.status === OrderStatus.Cancelled){
        throw new BadRequestError('Cannot pay for an cancelled order')
    }
    
    res.send({success : true})
});

export { router as createChargeRouter}