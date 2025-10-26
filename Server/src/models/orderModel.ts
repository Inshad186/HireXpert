import mongoose, { Schema, Document } from "mongoose";

interface OrderDocument extends Document {
  client: mongoose.Types.ObjectId;
  freelancer: mongoose.Types.ObjectId;
  gig: mongoose.Types.ObjectId;
  plan: "basic" | "standard" | "premium";
  requirements: string;
  status: "pending" | "accepted" | "inprogress" | "completed" | "cancelled";
  createdAt: Date;
}

const orderSchema = new Schema<OrderDocument>({
  client: { type: Schema.Types.ObjectId, ref: "ClientProfile" },
  freelancer: { type: Schema.Types.ObjectId, ref: "FreelancerProfile"},
  gig: { type: Schema.Types.ObjectId, ref: "Gig" },
  plan: { type: String, enum: ["basic", "standard", "premium"] },
  requirements: { type: String},
  status: {
    type: String,
    enum: ["pending", "accepted", "inprogress", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date },
});

export default mongoose.model<OrderDocument>("Order", orderSchema);
