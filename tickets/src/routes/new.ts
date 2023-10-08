import express ,{ Request , Response} from "express";
import { currentUser , requireAuth } from "@unaiztickets/common";

const router = express.Router()

router.post('/api/tickets',currentUser,requireAuth, async(req:Request,res:Response)=>{
    res.sendStatus(200)
})

export {router as createTicketRouter}