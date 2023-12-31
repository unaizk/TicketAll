import mongoose from "mongoose";
import { Order } from "./orders";
import { OrderStatus } from "@unaiztickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

//Interface describes the properties that are required to create Tickets
interface TicketAttrs{
    id : string
    title : string,
    price : number,
}


 //Intrface describes the properties that a Ticket document has after creating ticket
export interface TicketDocs extends mongoose.Document{
    title : string,
    price : number,
    version:number,
    isReserved():Promise<boolean> //This functions return a Promise that is boolean
}


//Interface describes the properties that requires that a Ticket model has
interface TicketModel extends mongoose.Model<TicketDocs>{
    build(attrs:TicketAttrs):TicketDocs;
    findByEvent(event :{id:string,version:number}):Promise<TicketDocs | null>

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

ticketSchema.set('versionKey','version') // This line sets the version key to 'version' in the Mongoose document. This version will automatically increase when a ticket is created or updated.

ticketSchema.plugin(updateIfCurrentPlugin) //This line adds the 'updateIfCurrentPlugin' to the schema. This plugin helps with optimistic concurrency control, ensuring that updates are applied only if the version number matches.

ticketSchema.statics.findByEvent = (event:{id : string, version : number}) =>{
    return Ticket.findOne({
        _id : event.id,
        version : event.version -1,
    })
}

ticketSchema.statics.build = (attrs:TicketAttrs)=>{
    return new Ticket({
        _id : attrs.id,   // Now when saving ticket in order service through event mongoDB will not generate random id it will pass the original ticket id as _id 
        title : attrs.title,
        price : attrs.price
    })
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
