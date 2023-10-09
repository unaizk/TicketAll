import express ,{ Request , Response} from "express";
import { requireAuth } from "@unaiztickets/common";
import { body } from "express-validator";
import { validateRequest } from "@unaiztickets/common";
import { Ticket } from "../models/ticket";

const router = express.Router()

router.post('/api/tickets',requireAuth,[
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({gt:0}).withMessage('Price must be greater than 0')
], validateRequest , async(req:Request,res:Response)=>{

    const {title,price} = req.body
    const tickets = Ticket.build({
        title:title,
        price:price,
        userId:req.currentUser!.id
    })

    await tickets.save()
    
    res.status(200).send(tickets)
})

export {router as createTicketRouter}