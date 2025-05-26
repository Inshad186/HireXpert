import mongoose, { Schema } from "mongoose";
import { UserType } from "@/types/Type";

const userSchema: Schema = new Schema<UserType>({
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
        default : "none"
    },
    isBlocked: {
        type : Boolean,
        default: false
    },
    companyName: { type: String },
    website: { type: String },
    industry: { type: String },
    address: { type: String },
    country: { type: String },
    workType: { type: [String] },
    budgetRange: { type: String },
    preferredTechStack: { type: String },

    //! Freelancer-specific 
    profession: { type: String },
    company: { type: String },
    qualification: { type: String },
    bio: { type: String },
    work_experience: { type: String },
    proficient_languages: { type :[String]},
    skills: { type: [String] },
    working_days: { type: String },
    active_hours: { type: String },
    basic_price: { type: Number },
    standard_price: { type: Number },
    premium_price: { type: Number },
    portfolio: { type: String },

}, { timestamps: true })

export default mongoose.model<UserType>("User", userSchema)