import mongoose, {ObjectId} from "mongoose"

export interface UserSignUpType {
    name : string,
    email : string,
    password : string,
    confirmPassword? : string 
    role? : "freelancer" | "client" | "admin" | "none" | "",
}


export type UserSignupAction =
    | { type: "SET_NAME"; payload: string }
    | { type: "SET_EMAIL"; payload: string }
    | { type: "SET_PASSWORD"; payload: string }
    | { type: "SET_CONFIRM_PASSWORD"; payload: string }


export interface ErrorState {
    field?: string;
    message?: string;
}

export interface UserStoreType {
    _id: string;
    name: string;
    email: string;
    role?: 'freelancer' | 'client' | 'admin' | 'none' | '';
    createdAt?: Date;
    isBlocked?:Boolean;
    updatedAt?: Date;
    accessToken : null;
    profilePicture?: string;
    companyName?: string;
    website?: string;
    industry?: string;
    address?: string;
    country?: string;
    workType?: string[];
    budgetRange?: string;
    preferredTechStack?: string;
    isIdentityVerified?: boolean;
    ratingsFromFreelancers?: Array<{ rating: number; comment: string }>;
}

export interface FreelancerDetail {
    user_id: mongoose.Schema.Types.ObjectId;
    profession: string;
    company: string;
    qualification: string;
    bio: string;
    work_experience: string;
    proficient_languages: string[];
    skills: string[];
    working_days: string;
    active_hours: string;
    basic_price: number;
    standard_price: number;
    premium_price: number;
    portfolio: string;
}
