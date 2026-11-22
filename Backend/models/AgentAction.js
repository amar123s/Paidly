import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", required: true },
    type: { type: String, enum: ["REMINDER"], required: true },
    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED", "FAILED"], default: "PENDING", index: true },
    subject: String,
    message: String,
    reasoning: String,
  },
  { timestamps: true }
);

schema.index({ invoice: 1 }, { unique: true, partialFilterExpression: { status: "PENDING" } });

export default mongoose.model("AgentAction", schema);