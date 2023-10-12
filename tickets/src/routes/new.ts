import express ,{ Request , Response} from "express";
import { requireAuth } from "@unaiztickets/common";
import { body } from "express-validator";
import { validateRequest } from "@unaiztickets/common";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publisher/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";


const router = express.Router()

router.post('/api/tickets', requireAuth, [
    body('title').not().isEmpty().withMessage('Title must be required'),
    body('price').isFloat({gt:0}).withMessage('Price must be required and greater than 0')
], validateRequest , async(req:Request,res:Response)=>{
    try {
        const {title,price} = req.body
        const ticket = Ticket.build({
            title,
            price,
            userId: req.currentUser!.id
        })
    
        await ticket.save()
    
        await new TicketCreatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId
        })
        console.log('ticket created');
        
        res.status(201).send(ticket)
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
})


export {router as createTicketRouter}