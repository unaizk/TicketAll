import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

//Interface describes the properties that are required to create Tickets
interface TicketAttrs{
    title : string,
    price : number,
    userId : string
}


 //Intrface describes the properties that a Ticket document has after creating ticket
interface TicketDocs extends mongoose.Document{
    title : string,
    price : number,
    userId : string,
    version : number
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
        required : true
    },
    userId : {
        type : String,
        required : true
    }
    
},{
    toJSON : {
        transform(doc,ret){
            ret.id = ret._id
            delete ret._id
            delete ret.__v
        }
    }
})

ticketSchema.set('versionKey','version') // we are setting our vesrion key as default in mongoose document as __v so by this setting it will set as 'version'

ticketSchema.plugin(updateIfCurrentPlugin) // added plugin 

ticketSchema.statics.build = (attrs:TicketAttrs)=>{
    return new Ticket(attrs)
}

const Ticket = mongoose.model<TicketDocs, TicketModel>('Ticket',ticketSchema)

export {Ticket}