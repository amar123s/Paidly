import mongoose from "mongoose";
import crypto from "node:crypto";


const invoiceSchema = new mongoose.Schema({
    owner:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,index:true},
    clientName:{type:String,required:true,trim:true},
    clientEmail:{type:String,required:true,lowercase:true,trim:true},
    itemName:{type:String,required:true,trim:true},
    amountCents:{type:Number,required:true,min:1},
    currency:{type:String,default:"USD"},
    note:String,
    dueDate:Date,
    status:{type:String,
        enum:["DRAFT","PAID","SENT","CANCELLED","SENDING","APPROVED","FAILED"],
        default:"DRAFT",index:true},
    requestId:{type:String,default:()=>crypto.randomUUID(),unique:true},
    paypalInvoiceId:{type:String,index:true},
    failureReason:String,
    paidAt:Date,
    },
{timestamps:true});

export default mongoose.model("Invoice",invoiceSchema)