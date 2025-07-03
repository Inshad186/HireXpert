import mongoose, {Schema, Document} from "mongoose";

export interface IFreelancerProfile extends Document {
  user: mongoose.Types.ObjectId;
  profession?: string;
  company?: string;
  qualification?: string;
  bio?: string;
  work_experience?: string;
  proficient_languages?: string[];
  skills: [{ type: Schema.Types.ObjectId, ref: "Skill" }]
  working_days?: string;
  active_hours?: string;
  basic_price?: number;
  standard_price?: number;
  premium_price?: number;
  portfolio?: string;
}

const freelancerProfileSchema = new Schema<IFreelancerProfile>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: false },
  profession: String,
  company: String,
  qualification: String,
  bio: String,
  work_experience: String,
  proficient_languages: [String],
  skills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
  working_days: String,
  active_hours: String,
  basic_price: Number,
  standard_price: Number,
  premium_price: Number,
  portfolio: String,
}, { timestamps: true });

export default mongoose.model<IFreelancerProfile>("FreelancerProfile", freelancerProfileSchema);
