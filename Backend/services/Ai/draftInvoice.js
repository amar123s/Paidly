import z from "zod";
import { ai } from "./client.js";
import { withRetry } from "./withRetry.js";

const draftSchema = z.object({
    clientName:z.string().min(1),
    clientEmail:z.string().email().optional(),
    itemName:z.string().min(1).max(120),
    amountCents:z.number().int().positive().max(10_000_000),
    note:z.string().max(500),
    dueInDays:z.number().int().min(1).max(90),
});

const jsonSchema = {
  type: "object",
  properties: {
    clientName: { type: "string" },
    clientEmail: { type: "string", description: "Omit if not in the notes" },
    itemName: { type: "string", description: "Short description of the work" },
    amountCents: { type: "integer", description: "Total in cents, e.g. $100.00 = 10000" },
    note: { type: "string", description: "A polite one or two sentence message to the client" },
    dueInDays: { type: "integer", description: "Days until due; use 14 if not stated" },
  },
  required: ["clientName", "itemName", "amountCents", "note", "dueInDays"],
};

const models = [process.env.AI_MODEL,process.env.AI_FALLBACK_MODEL].filter(Boolean);

const callGemini = (model, notes) =>
  ai.models.generateContent({
    model,
    contents: notes,
    config: {
      systemInstruction:
        "You turn a freelancer's rough notes into an invoice draft. Never invent names, emails or amounts. If a value is missing, omit it. Amounts are in USD unless stated.",
      responseMimeType: "application/json",
      responseJsonSchema: jsonSchema,
      abortSignal: AbortSignal.timeout(15_000), 
    },
  });

export async function draftInvoices(notes) {
  const response = await withRetry((model) => callGemini(model, notes), models);
  return draftSchema.parse(JSON.parse(response.text));
}
