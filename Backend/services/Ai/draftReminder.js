import { z } from "zod";

const schema = z.object({
  subject: z.string().min(1).max(100),
  message: z.string().min(1).max(600),
  reasoning: z.string().max(300),
});

export async function draftReminder(invoice, daysOverdue) {
  const prompt = `Write a payment reminder for a freelancer's client.
Client: ${invoice.clientName}. Work: ${invoice.itemName}. Amount: $${(invoice.amountCents / 100).toFixed(2)}. Days overdue: ${daysOverdue}.
Tone: friendly if 7 days or fewer, firm but polite if 8 to 21, final notice but still professional if over 21.
Never threaten, never invent facts. Return JSON: subject, message, reasoning (one sentence on why this tone).`;

  const raw = await callYourGeminiHelper(prompt); 
  return schema.parse(raw);
}