import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@unaiztickets/common';
import express , {Request, Response} from 'express'
import { body } from 'express-validator';
import { Order } from '../model/order';
import { stripe } from '../stripe';
import { StartPosition } from 'node-nats-streaming';

const router = express.Router();

router.post('/api/payment', requireAuth, [
    body('token')
    .not()
    .isEmpty(),

    body('orderId')
    .not()
    .isEmpty()
],validateRequest, async(req : Request, res : Response)=>{

    const {token , orderId} = req.body;

    const order = await Order.findOne({id : '6532194f06d77e2f4df6c002'});

    // if(!order){
    //     throw new NotFoundError()
    // }

    // if(order.userId !== req.currentUser!.id){
    //     throw new NotAuthorizedError()
    // }

    // if(order.status === OrderStatus.Cancelled){
    //     throw new BadRequestError('Cannot pay for an cancelled order')
    // }

    await stripe.charges.create({
        amount : order!.price * 100,
        currency : 'usd',
        source : token
    })
    
    res.send({success : true})
});

export { router as createChargeRouter}