import "dotenv/config";
import { Worker } from "bullmq";
import connection from "../config/redis.js";
import { ConnectDB } from "../config/Database.js";
import Invoice from "../models/Invoice.js";
import { createAndSendInvoice } from "../services/paypal/invoice.js";


await ConnectDB();

const worker = new Worker(
    "invoices", async(job)=>{
        const invoice =  await Invoice.findById(job.data.invoiceId);
        if(!invoice || invoice.status === "SENT") return;

        invoice.status = "SENDING";
        await invoice.save();

        const paypalInvoiceId=await createAndSendInvoice({
            requestId:invoice.requestId,
            recipientEmail:invoice.clientEmail,
            recipientName:invoice.clientName,
            itemName:invoice.itemName,
            amount:(invoice.amountCents/100).toFixed(2),
            note:invoice.note,
        });

        invoice.paypalInvoiceId=paypalInvoiceId;
        invoice.status="SENT";
        await invoice.save();
    },
    {connection,concurrency:5}
);

worker.on("FAILED",async(job,err)=>{
    console.error("Job failed",job?.id,err.message);
    if(job && job.attemptsMade >= job.opts.attempts){
        await Invoice.findByIdAndUpdate(job.data.invoiceId,{status:"failed"});
    }
});