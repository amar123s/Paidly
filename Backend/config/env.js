import "dotenv/config";
import {z} from "zod";

const schema = z.object({
    PORT: z.coerce.number().default(5001),
    MONGO_URL: z.string().min(1),
    REDIS_URL: z.string().min(1),
    JWT_SECRET: z.string().min(32),
    PAYPAL_CLIENT_ID: z.string().min(1),
    PAYPAL_CLIENT_SECRET: z.string().min(1),
    PAYPAL_BASE_URL: z.string().url(),
    PAYPAL_WEBHOOK_ID: z.string().min(1),
})


export const env = schema.parse(process.env)