import mongoose, { ObjectId } from "mongoose";

export interface UserType extends Document {
    _id?: ObjectId;
    name?: string;
    email: string;
    password?: string;
    role?: 'freelancer' | 'client' | 'admin';
    isBlocked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
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

    //! Freelancer fields
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


export interface FileType {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}

export interface GoogleAuthUserType {
    email: string;
    name: string;
    profilePicture?: string;
}