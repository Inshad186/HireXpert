import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  subject?: "" | "hiring" | "freelancer" | "billing" | "other";
  message?: string;
  status?: "NEW" | "READ" | "RESOLVED";
}

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 150 },
    subject: { type: String, enum: ["", "hiring", "freelancer", "billing", "other"], default: "" },
    message: { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
    status: { type: String, enum: ["NEW", "READ", "RESOLVED"], default: "NEW" },
  },
  { timestamps: true }
);
contactSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model<IContact>("Contact", contactSchema);