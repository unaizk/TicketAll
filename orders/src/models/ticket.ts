import mongoose from "mongoose";
import { Order } from "./orders";
import { OrderStatus } from "@unaiztickets/common";


//Interface describes the properties that are required to create Tickets
interface TicketAttrs{
    title : string,
    price : number,
}


 //Intrface describes the properties that a Ticket document has after creating ticket
export interface TicketDocs extends mongoose.Document{
    title : string,
    price : number,
    isReserved():Promise<boolean> //This functions return a Promise that is boolean
}


//Interface describes the properties that requires that a Ticket model has
interface TicketModel extends mongoose.Model<TicketDocs>{
    build(attrs:TicketAttrs):TicketDocs
}


const ticketSchema = new mongoose.Schema({
    title:{
        type: String,
        required : true
    },
    price:{
        type:Number,
        required : true,
        min : 0
    }
    
},{
    toJSON : {
        transform(doc,ret){
            ret.id = ret._id
            delete ret._id
            
        }
    }
})

ticketSchema.statics.build = (attrs:TicketAttrs)=>{
    return new Ticket(attrs)
}

ticketSchema.methods.isReserved = async function(){
    //this === the ticket document that we just called isReserved()
    const existingOrder = await Order.findOne({
        ticket:this,
        status:{
            $in:[
                OrderStatus.Created,
                OrderStatus.Complete,
                OrderStatus.AwaitingPayment
            ]
        }
    });
    return !!existingOrder // if there is existing order it will return true else false
}

const Ticket = mongoose.model<TicketDocs, TicketModel>('Ticket',ticketSchema)

export {Ticket}
