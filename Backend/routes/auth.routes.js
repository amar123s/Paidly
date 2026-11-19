import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js"
import z from "zod";
import { requireAuth } from "../middleware/auth.js";

const router= Router();

const registerSchema = z.object({
    name:z.string().min(1),
    email:z.string().email().toLowerCase(),
    password:z.string().min(8)
});

const loginSchma = z.object({
    email:z.string().email().toLowerCase(),
    password:z.string().min(1),
});

const sign = (user)=>
    jwt.sign({id:user._id.toString()},process.env.JWT_SECRET,{expiresIn:"7d"});


router.post("/register",async(req,res)=>{
    const {name,email,password} = registerSchema.parse(req.body);
    if(await User.exists({email})) return res.status(409).json({error:"Email already registered"});
    const user = await User.create({name,email,passwordHash:await bcrypt.hash(password,10)});
    res.status(201).json({token:sign(user),user:{id:user._id,name,email}});
});

router.post("/login",async(req,res)=>{
    const {email,password} = loginSchma.parse(req.body);
    const user = await User.findOne({email});

    const ok = user && (await bcrypt.compare(password,user.passwordHash));
    if(!ok) return res.status(401).json({error:"Invalid credentials"});
    res.json({token:sign(user),user:({id:user._id,name:user.name,email})});
});

router.get("/me",requireAuth,async(req,res)=>{
    res.json(await User.findById(req.user.id).select("-passwordHash"));
});

export default router;
