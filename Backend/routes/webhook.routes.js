import { Router } from "express";
import redis from "ioredis";
import Invoice from "../models/Invoice.model.js";
import { paypalRequest } from "../services/paypal/client.js";

const router=Router();

router.post("/paypal",async(req,res)=>{
    const h= req.headers;
    const event = req.body;


    const check = await paypalRequest
    ("/v1/notifications/verify-webhook-signature",{
        method:"POST",
        body:{
            auth_algo:h["paypal-auth-algo"],
            cert_url:h["paypal-cert-url"],
            transmission_id:h["paypal-transmission-id"],
            transmission_sig:h["paypal-transmission-sig"],
            transmission_time:h["paypal-transmission-time"],
            webhook_id:process.env.PAYPAL_WEBHOOK_ID,
            webhook_event:event,
        },
    });
    if(check.verification_status !=="SUCCESS")
        return res.sendStatus(400);

    const key= `webhook:${event.id}`;
    const firstTime= await redis.set(key,"1","EX",86400,"NX");
    if(!firstTime) 
        return  res.sendStatus(200);

    try{
        if(event.event_type === "INVOICING.INVOICE.PAID"){
            const paypalId = event.resource?.invoice?.id??event.resource?.id;
            console.log("PAID event for",paypalId);
            await Invoice.findOneAndUpdate(
                {paypalInvoiceId:paypalId},
                {status:"PAID",paidAt:new Date()}
            );
        }
        res.sendStatus(200);
    }catch(err){
        await redis.del(key);
        throw err;
    }
});

export default router