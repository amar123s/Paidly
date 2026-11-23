import "dotenv/config";
import { Worker } from "bullmq";
import connection from "../config/Redis.js";
import { ConnectDB } from "../config/Database.js";
import Invoice from "../models/Invoice.model.js";
import AgentAction from "../models/AgentAction.js";
import { draftReminder } from "../services/Ai/draftReminder.js";
import { reminderQueue } from "../queue/reminder.queue.js";

await ConnectDB();
console.log("reminder worker started");

await reminderQueue.upsertJobScheduler("overdue-scan", { pattern: "0 9 * * *" }, { name: "scan" });

const worker = new Worker(
  "reminders",
  async () => {
    console.log("scan job received");
    const overdue = await Invoice.find({ status: "SENT", dueDate: { $lt: new Date() } });
    console.log("scan: found", overdue.length, "overdue invoice(s)");

    for (const inv of overdue) {
      if (await AgentAction.exists({ invoice: inv._id, status: "PENDING" })) continue;
      const daysOverdue = Math.floor((Date.now() - inv.dueDate) / 86_400_000);
      try {
        const d = await draftReminder(inv, daysOverdue);
        await AgentAction.create({ owner: inv.owner, invoice: inv._id, type: "REMINDER", ...d });
        console.log("action created for", inv._id.toString());
      } catch (err) {
        console.log("Reminder failed for", inv._id.toString(), err.message);
      }
    }
  },
  { connection }
);

worker.on("completed", () => console.log("scan done"));
worker.on("failed", (job, err) => console.error("scan failed:", err.message));