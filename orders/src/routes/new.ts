import express ,{Request,Response} from 'express'
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { requireAuth , validateRequest , NotFoundError, OrderStatus, BadRequestError } from '@unaiztickets/common';
import { Order  } from '../models/orders';
import { Ticket } from '../models/ticket';


const router = express.Router();

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

    //Build the order and save it to the database

    //Publish an event saying that an order was created
    res.send({})
})

export {router as newOrdersRouter}