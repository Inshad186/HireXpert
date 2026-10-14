import mongoose, { Schema, Document } from "mongoose";

export interface IGig extends Document {
  freelancer: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  skills: mongoose.Types.ObjectId[];
  pricing: {
    basic: {
      price: number;
      description: string;
      deliveryTime: number
    }
    standard?: {
      price: number;
      description: string;
      deliveryTime: number
    }
    premium?: {
      price: number;
      description: string;
      deliveryTime: number
    }
  };
  isActive:boolean;
  gallery: string[];
}


const gigSchema = new Schema<IGig>({
  freelancer: { type: Schema.Types.ObjectId, ref: "FreelancerProfile", required: false },
  title: { type: String, required: false, maxlength:100 },
  description: {type: String, required: false, maxlength:100 },
  category: { type: String, required: false },
  skills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
  pricing: {
    basic: { 
      price: {type: Number, required: false, min: 0 },
      description: {type:String, required: false},
      deliveryTime: {type:Number, required: false, min: 1}
     },
    standard: {
      price: {type: Number, required: false, min: 0 },
      description: {type:String, required: false},
      deliveryTime: {type:Number, required: false, min: 1}
    },
    premium: {
      price: {type: Number, required: false, min: 0 },
      description: {type:String, required: false},
      deliveryTime: {type:Number, required: false, min: 1}
    }
  },
  isActive: {type: Boolean, default: false },
  gallery: [String]
}, { timestamps: false });

export default mongoose.model<IGig>("Gig", gigSchema);