import express ,{Request,Response} from 'express'
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { requireAuth , validateRequest ,  } from '@unaiztickets/common';

const router = express.Router();

router.post('/api/orders', requireAuth, [
    body('ticketId')
    .not()
    .isEmpty()
    .custom((input:string) => mongoose.Types.ObjectId.isValid(input)) // the TicketId should be similar to mongoId otherwise it will validate an error
    .withMessage('Ticket Id must be provided')
], validateRequest,
async(req : Request, res : Response)=>{
    res.send({})
})

export {router as newOrdersRouter}