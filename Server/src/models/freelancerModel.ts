import mongoose, {Schema, Document} from "mongoose";

export interface IFreelancerProfile extends Document {
  user: mongoose.Types.ObjectId;
  name?: string;
  email?: string;
  role?: string;
  profession?: string;
  company?: string;
  qualification?: string;
  bio?: string;
  work_experience?: string;
  profileSkills: [{ type: Schema.Types.ObjectId, ref: "Skill"}];
  proficient_languages?: string[];
  working_days?: string;
  active_hours?: string;
  portfolio?: string;
  stripeConnectedAccountId?: string;
  stripeOnboardingComplete?: { type: Boolean, default: false}
  isSeller?: string;
}

const freelancerProfileSchema = new Schema<IFreelancerProfile>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: false },
  name: {type: String},
  email: {type: String},
  role: {type: String},
  profession: {type: String},
  company: {type: String},
  qualification: {type: String},
  bio: {type: String},
  work_experience: {type: String},
  profileSkills: [{type: Schema.Types.ObjectId, ref: "Skill"}],
  proficient_languages: [String],
  working_days: {type: String},
  active_hours: {type: String},
  portfolio: {type: String},
  stripeConnectedAccountId: {type: String},
  stripeOnboardingComplete: {type: Boolean},
  isSeller: {type: Boolean, default: false},
}, { timestamps: true });

export default mongoose.model<IFreelancerProfile>("FreelancerProfile", freelancerProfileSchema);
