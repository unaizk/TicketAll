import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@unaiztickets/common';
import express , {Request, Response} from 'express'
import { body } from 'express-validator';
import { Order } from '../model/order';
import { stripe } from '../stripe';
import { StartPosition } from 'node-nats-streaming';
import { Payment } from '../model/payment';
import { PaymentCreatedPublisher } from '../events/publisher/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

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

    const order = await Order.findOne(orderId);

    if(!order){
        throw new NotFoundError()
    }

    if(order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError()
    }

    if(order.status === OrderStatus.Cancelled){
        throw new BadRequestError('Cannot pay for an cancelled order')
    }

    const charge = await stripe.charges.create({
        currency : 'inr',
        amount : order.price * 100,
        source : token
    })

    const payment = Payment.build({
        orderId,
        stripeId : charge.id
    })

    await payment.save()

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id : payment.id,
        orderId : payment.orderId,
        stripeId : payment.stripeId
    })
    
    res.status(201).send({id : payment.id})
});

export { router as createChargeRouter}