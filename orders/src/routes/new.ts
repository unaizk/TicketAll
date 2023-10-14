import express ,{Request,Response} from 'express'
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { requireAuth , validateRequest , NotFoundError, OrderStatus, BadRequestError } from '@unaiztickets/common';
import { Order  } from '../models/orders';
import { Ticket } from '../models/ticket';
import { OrderCreatedPublisher } from '../events/publisher/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';


const router = express.Router();

const EXPIRATION_WINDOW_SECODS = 15 * 60;

router.post('/api/orders', requireAuth, [
    body('ticketId')
    .not()
    .isEmpty()
    .custom((input:string) => mongoose.Types.ObjectId.isValid(input)) // the TicketId should be similar to mongoId otherwise it will validate an error
    .withMessage('Ticket Id must be provided')
], validateRequest,
async(req : Request, res : Response)=>{

    const { ticketId } = req.body
    //FInd the ticket user is trying to order in the database 
    const ticket = await Ticket.findById(ticketId)

    if(!ticket){
        throw new NotFoundError()
    }

    //Make sure this ticket is not already reserved(SO to check that ticket is already reserved we have to find the order based on this ticket and check the status of that order does not have cancelled status if we got the order it means the ticket is reserved)

    const isReserved = await ticket.isReserved()

    if(isReserved){
        throw new BadRequestError('Ticket is already reserved')
    }
    //Calculate an expiration date for this order
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECODS)

    //Build the order and save it to the database
    const order = Order.build({
        userId : req.currentUser!.id,
        status : OrderStatus.Created,
        expiresAt : expiration,
        ticket
    })

    await order.save()

    //Publish an event saying that an order was created
    await new OrderCreatedPublisher(natsWrapper.client).publish({
        id : order.id,
        userId : order.userId,
        status : order.status,
        expiresAt : order.expiresAt.toISOString(),
        ticket : {
            id: ticket.id,
            price : ticket.price
        }
    })

     
    res.status(201).send(order)
})

export {router as newOrdersRouter}