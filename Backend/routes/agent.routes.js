import { Router } from "express";
import z from "zod";
import { requireAuth } from "../middleware/auth.js";
import { draftInvoices } from "../services/Ai/draftInvoice.js";

const router=Router();
router.use(requireAuth);

router.post("/draft-invoice",async (req,res)=>{
    const {notes} = z.object({notes:z.string().min(10).max(2000)}).parse(req.body);
    let draft;
    try{
        draft = await draftInvoices(notes);
    }catch (err) {
        return res.status(503).json({ error: "AI is busy right now, please try again in a moment" });
}

    const {dueInDays, ...fields}= draft;
    const dueDate= new Date(Date.now()+ dueInDays*86_400_000);
    const missing =["clientEmail"].filter((f)=>!fields[f]);

    res.json({draft:{...fields,dueDate},missing});
});

export default router