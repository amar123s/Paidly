import Router from "express";
import mongoose from "mongoose";
import {requireAuth} from "../middleware/auth.js"
import Invoice from "../models/Invoice.model.js"


const router=Router();
router.use(requireAuth);

router.get("/",async(req,res)=>{
    const owner = new mongoose.Types.ObjectId(req.user.id);
    const byStatus = await Invoice.aggregate([
        {$match:{owner}},
        {$group:{_id:"$status",count:{$sum:1},totalCents:{$sum:"$amountCents"}}},
    ]);
    const overdue = await Invoice.countDocuments({owner,status:"SENT",dueDate:{$lt:new Date()}});
    res.json({byStatus,overdue});
});

export default router;