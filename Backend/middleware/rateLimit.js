import rateLimit from "express-rate-limit";
import {RedisStore} from "rate-limit-redis";
import redis from "../config/Redis.js";

export const aiLimiter= rateLimit({
    windowMs:60_000,
    limit:10,
    standardHeaders:true,
    keyGenerator:(req)=> req.user.id,
    store:new RedisStore({sendCommand:(command, ...args)=> redis.call(command, ...args)})
});