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
  profileSkills: [{
    type: Schema.Types.ObjectId,
    ref: "Skill"
  }];
  proficient_languages?: string[];
  working_days?: string;
  active_hours?: string;
  portfolio?: string;
}

const freelancerProfileSchema = new Schema<IFreelancerProfile>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: false },
  name: String,
  email: String,
  role: String,
  profession: String,
  company: String,
  qualification: String,
  bio: String,
  work_experience: String,
  profileSkills: [{
    type: Schema.Types.ObjectId,
    ref: "Skill"
  }],
  proficient_languages: [String],
  working_days: String,
  active_hours: String,
  portfolio: String,
}, { timestamps: true });

export default mongoose.model<IFreelancerProfile>("FreelancerProfile", freelancerProfileSchema);
