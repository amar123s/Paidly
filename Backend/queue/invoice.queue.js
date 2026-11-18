import { Queue } from "bullmq";
import connection from "../config/redis.js";

export const invoiceQueue= new Queue("invoices",{connection});
