import IORedis from "ioredis";
import "dotenv/config";

const connection = new IORedis(process.env.REDIS_URL,
    {maxRetriesPerRequest:null});


connection.on("error",(err)=> console.error("Redis error:",err.message));

export default connection;