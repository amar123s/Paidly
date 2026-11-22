import {Queue} from "bullmq";
import connection from "../config/Redis.js"


export const reminderQueue= new Queue("reminders",{connection});