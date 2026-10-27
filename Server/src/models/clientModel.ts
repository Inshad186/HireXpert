import mongoose, {Schema, Document} from "mongoose";

export interface IClientProfile extends Document {
  user: mongoose.Types.ObjectId;
  name?: string;
  email?: string;
  role?: string;
  accountType: "individual" | "company";
  companyName?: string;
  companySize?: "1" | "2-10" | "11-50" | "51-200" | "200+";
  about?: string;
  website?: string;
  industry?: string;
  address?: string;
  country?: string;
  workType?: "Short-term" | "Long-term" | "Both";
  budgetRange?: string;
  preferredTechStack?: string;
}

const clientProfileSchema = new Schema<IClientProfile>({
  user: { type: Schema.Types.ObjectId, ref: "User", unique: true, sparse: true },
  name: { type: String, trim: true, maxlength: 100 },
  email: { type: String, trim: true, lowercase: true },
  role: String,
  accountType: { type: String, enum: ["individual", "company"], default: "individual" },
  companyName: { type: String, trim: true, maxlength: 100 },
  companySize: { type: String, enum: ["1", "2-10", "11-50", "51-200", "200+"] },
  about: { type: String, trim: true, maxlength: 500 },
  website: { type: String, trim: true, maxlength: 200 },
  industry: { type: String, trim: true, maxlength: 100 },
  address: { type: String, trim: true, maxlength: 200 },
  country: { type: String, trim: true, maxlength: 100 },
  workType: { type: String, enum: ["Short-term", "Long-term", "Both"] },
  budgetRange: { type: String, trim: true, maxlength: 50 },
  preferredTechStack: { type: String, trim: true, maxlength: 200 },
}, { timestamps: true });

export default mongoose.model<IClientProfile>("ClientProfile", clientProfileSchema);