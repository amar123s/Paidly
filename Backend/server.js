import "dotenv/config"
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { ConnectDB } from "./config/Database.js";
import { ZodError } from "zod";

import webhookRoutes from "./routes/webhook.routes.js"
import invoiceRoutes from "./routes/invoice.routes.js"
import authRoutes from "./routes/auth.routes.js"
import agentRoutes from "./routes/agent.routes.js"

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/health",(req,res)=>res.json({ok:true}));
app.use("/api/invoices",invoiceRoutes)
app.use("webhook",webhookRoutes)
app.use("/api/auth",authRoutes)
app.use("/api/agent",agentRoutes)


app.use((err,req,res,next)=>{
    if(err instanceof ZodError) 
        return res.status(400).json({error:err.issues});
    console.log(err);
    res.status(500).json({error:'Internal error'})
})


ConnectDB().then(()=>
app.listen(PORT,()=>console.log(`Server is live on ${PORT}`)))
.catch((err)=>{
    console.error("Startup failed:",err);
    process.exit(1);
});
