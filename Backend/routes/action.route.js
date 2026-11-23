import Router from "express";
import AgentAction from "../models/AgentAction.js";
import {requireAuth} from "../middleware/auth.js"
import { sendReminder } from "../services/paypal/invoice.js";
import { aiLimiter } from "../middleware/rateLimit.js";

const router = Router();
router.use(requireAuth,aiLimiter);


router.use("/",async(req,res)=>{
    res.json(
        await AgentAction.find({owner:req.user.id,status:"PENDING"})
        .populate("invoice","clientName itemName amountCents dueDate")
    );
});

router.post("/:id/approve", async(req,res)=>{
    const action= await AgentAction.findOneAndUpdate(
        {_id:req.params.id, owner:req.user.id,status:"PENDING"},
        {status:"APPROVED"},
        {new:true}
    ).populate("invoice");
    if(!action) return res.status(409).json({error:"Not pending"});


    try{
        await sendReminder(action.invoice.paypalInvoiceId, action.subject,action.message);
    }catch(err){
        action.status="FAILED";
        await action.save();
        throw err;
    }
    res.json(action);
});

router.post("/:id/reject",async(req,res)=>{
    const action = await AgentAction.findOneAndUpdate(
        {_id:req.params.id, owner:req.user.id,status:"PENDING"},
        {status:"REJECTED"},
        {new:true}
    );
    if(!action) return res.status(409).json({error:"Not pending"});
    re.json(action);
});

export default router;