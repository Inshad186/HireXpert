import mongoose, { Schema, Document } from "mongoose";

export interface IUserBase extends Document {
  name: string;
  email: string;
  password?: string;
  profilePicture?: string;
  role?: "freelancer" | "client" | "admin" | "none";
  isBlocked: boolean;
}

const userBaseSchema = new Schema<IUserBase>({
  name: { 
    type: String, 
    required: true 
},
  email: { 
    type: String, 
    required: true, 
    unique: true 
},
  password: { 
    type: String 
},
  profilePicture: { 
    type: String, 
    default: "" 
},
  role: { 
    type: String, 
    enum: ["freelancer", "client", "admin", "none"], 
    default: "none" 
},
  isBlocked: { 
    type: Boolean, 
    default: false 
},

}, { timestamps: true });

export default mongoose.model<IUserBase>("User", userBaseSchema);
