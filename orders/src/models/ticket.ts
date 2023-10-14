import mongoose from "mongoose";


//Interface describes the properties that are required to create Tickets
interface TicketAttrs{
    title : string,
    price : number,
}


 //Intrface describes the properties that a Ticket document has after creating ticket
export interface TicketDocs extends mongoose.Document{
    title : string,
    price : number,
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

const Ticket = mongoose.model<TicketDocs, TicketModel>('Ticket',ticketSchema)

export {Ticket}
