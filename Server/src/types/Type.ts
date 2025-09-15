import { Document, Types } from "mongoose";

export interface UserType extends Document {
//   _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role?: 'freelancer' | 'client' | 'admin' | 'none';
  isBlocked?: boolean;
  profilePicture?: string;
  isIdentityVerified?: boolean;
  ratingsFromFreelancers?: Array<{ rating: number; comment: string }>;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface ClientProfileType extends Document {
  user: Types.ObjectId;
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


export interface FreelancerProfileType extends Document {
  user: Types.ObjectId;
  name: string,
  role: string,
  profession: string;
  company: string;
  qualification: string;
  bio: string;
  work_experience: string;
  profileSkills: string[];
  proficient_languages: string[];
  working_days: string;
  active_hours: string;
  portfolio: string;
}

export interface CategoryType extends Document {
  name : string
}

export interface SkillType extends Document {
  name : string
}

export interface GigType extends Document {
  freelancer?: Types.ObjectId;
  title?: string;
  description?: string;
  category?: string;
  skills?: Types.ObjectId[]; 
  deliveryTime?: number;
  price?: {
    basic?: number;
    standard?: number;
    premium?: number;
  };
  isActive?:boolean;
  gallery?: string[];
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