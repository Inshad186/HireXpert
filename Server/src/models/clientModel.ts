import mongoose, {Schema, Document} from "mongoose";

export interface IClientProfile extends Document {
  user: mongoose.Types.ObjectId;
  name?: string;
  email?: string;
  role?: string;
  companyName?: string;
  website?: string;
  industry?: string;
  address?: string;
  country?: string;
  workType?: string[];
  budgetRange?: string;
  preferredTechStack?: string;
}

const clientProfileSchema = new Schema<IClientProfile>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: false },
  name: String,
  email: String,
  role: String,
  companyName: String,
  website: String,
  industry: String,
  address: String,
  country: String,
  workType: [String],
  budgetRange: String,
  preferredTechStack: String,
}, { timestamps: true });

export default mongoose.model<IClientProfile>("ClientProfile", clientProfileSchema);
