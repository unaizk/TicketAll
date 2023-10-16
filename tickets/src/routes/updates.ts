import express, {Request, Response} from 'express'
import { Ticket } from '../models/ticket'
import { body } from 'express-validator'
import { requireAuth , validateRequest, NotFoundError, NotAuthorizedError  } from '@unaiztickets/common'
import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.put('/api/tickets/:id', requireAuth ,[
    body('title')
    .not()
    .isEmpty()
    .withMessage('Title must be required'),

    body('price')
    .isFloat({gt:0})
    .withMessage('Price must be required and greater than 0')
],
validateRequest,
 async( req : Request, res : Response )=>{
    const id = req.params.id;

    const tickets = await Ticket.findById(id);

    if(!tickets){
        throw new NotFoundError()
    }

    if(tickets.userId !== req.currentUser!.id){
        throw new NotAuthorizedError()
    }

    tickets.set({
        title : req.body.title,
        price : req.body.price
    })


    await tickets.save()

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id:tickets.id,
        title:tickets.title,
        price:tickets.price,
        userId:tickets.userId,
        version : tickets.version
    })

    res.send(tickets)
})

export {router as updateTicketRouter}