import "dotenv/config"
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { ZodError } from "zod";
import mongoose from "mongoose";
import connection from "./config/Redis.js"

import webhookRoutes from "./routes/webhook.routes.js"
import invoiceRoutes from "./routes/invoice.routes.js"
import authRoutes from "./routes/auth.routes.js"
import agentRoutes from "./routes/agent.routes.js"
import actionRoutes from "./routes/action.route.js"
import statsRoutes from "./routes/stats.routes.js"

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
app.use("/api/actions",actionRoutes)
app.use("/api/stats",statsRoutes)


app.use((err,req,res,next)=>{
    if(err instanceof ZodError) 
        return res.status(400).json({error:err.issues});
    console.log(err);
    res.status(500).json({error:'Internal error'})
})

app.get("/health", (req, res) => res.json({ ok: true }));
app.get("/ready", async (req, res) => {
  const mongoOk = mongoose.connection.readyState === 1;
  const redisOk = (await connection.ping().catch(() => null)) === "PONG";
  res.status(mongoOk && redisOk ? 200 : 503).json({ mongo: mongoOk, redis: redisOk });
});


export default app;