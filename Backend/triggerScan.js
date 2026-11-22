import "dotenv/config";
import { reminderQueue } from "./queue/reminder.queue.js";

await reminderQueue.add("scan", {});
console.log("scan queued");
process.exit(0);