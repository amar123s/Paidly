import Invoice from "../models/Invoice.js";
import z from "zod";
import { Router } from "express";
import { invoiceQueue } from "../queue/invoice.queue.js";

const router = Router();

const createSchema= z.object({
    clientName:z.string().min(1),
    clientEmail:z.string().email(),
    itemName:z.string().min(1),
    amountCents:z.number().int().positive(),
    note:z.string().max(500).optional(),
    dueDate:z.coerce.date().optional(),
});

router.post("/",async(req,res)=>{
    const data = createSchema.parse(req.body);
    const invoice= await Invoice.create(data);
    res.status(201).json(invoice)
});

router.get("/",async(req,res)=>{
    res.json((await Invoice.find()).toSorted({createdAt:-1}));
});

router.get("/:id",async(req,res)=>{
    const invoice= await Invoice.findById(req.params.id);
    if(!invoice) return res.status(404).json({error:"Not Found"});
    res.json(invoice);
});

//Approve : DRAFT -> APPROVED,then enqueue the send job.
router.post("/:id/approve",async(req,res)=>{
    const invoice = await Invoice.findOneAndUpdate(
        {_id:req.params.id,status:"DRAFT"},
        {status:"APPROVED"},
        {new:true},
    );
    if(!invoice) return res.status(409).json({error:"Invoice is not a draft"});

    await invoiceQueue.add("send-invoice",
        {invoiceId:invoice._id.toString()},
        {jobId:`send-${invoice._id}`,attempts:3,backoff:{type:"exponential",delay:5000}}  
    );
    res.json(invoice)
});


export default router;