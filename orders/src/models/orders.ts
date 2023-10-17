import { OrderStatus } from "@unaiztickets/common";
import mongoose from "mongoose";
import { TicketDocs } from "./ticket";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";


//Interface describes the properties that are required to create Tickets
interface OrderAttrs{
    userId:string,
    status:OrderStatus,
    expiresAt:Date,
    ticket:TicketDocs
}

//Intrface describes the properties that a Ticket document has after creating ticket
interface OrderDoc extends mongoose.Document{
    userId:string,
    status:OrderStatus,
    expiresAt:Date,
    version:number,
    ticket:TicketDocs
}

//Interface describes the properties that requires that a Ticket model has
interface OrderModel extends mongoose.Model<OrderDoc>{
    build(attrs:OrderAttrs):OrderDoc
}


const orderSchema = new mongoose.Schema({
    userId: {
        type : String,
        required : true
    },
    status:{
        type:String,
        required:true,
        enum:Object.values(OrderStatus),
        default:OrderStatus.Created
    },
    expiresAt:{
        type:mongoose.Schema.Types.Date
    },
    ticket:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Ticket'
    }
},{
    toJSON:{
        transform(doc, ret) {
            ret.id = ret._id,
            delete ret._id
        },
    }
}
)


orderSchema.set('versionKey','version');

orderSchema.plugin(updateIfCurrentPlugin)


orderSchema.statics.build = (attrs:OrderAttrs)=>{
    return new Order(attrs)
}

const Order = mongoose.model<OrderDoc,OrderModel>('Order',orderSchema)

export { Order }