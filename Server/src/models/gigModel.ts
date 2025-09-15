import mongoose, { Schema, Document } from "mongoose";

export interface IGig extends Document {
  freelancer: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  skills: mongoose.Types.ObjectId[];
  deliveryTime: number;
  price: {
    basic: number;
    standard?: number;
    premium?: number;
  };
  isActive:boolean;
  gallery: string[];
}


const gigSchema = new Schema<IGig>({
  freelancer: { type: Schema.Types.ObjectId, ref: "FreelancerProfile", required: false },
  title: { type: String, required: false },
  description: { type: String, required: false },
  category: { type: String, required: false },
  skills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
  deliveryTime: { type: Number, required: false },
  price: {
    basic: { type: Number, required: false },
    standard: Number,
    premium: Number
  },
  isActive: {
    type: Boolean,
    default: false
  },
  gallery: [String]
}, { timestamps: false });

export default mongoose.model<IGig>("Gig", gigSchema);