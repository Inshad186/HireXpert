import mongoose, {ObjectId, Types} from "mongoose"

export type UserRole = "freelancer" | "client" | "admin" | "none";

//! UserSignUpType
export interface UserSignUpType {
    name : string,
    email : string,
    password : string,
    confirmPassword? : string 
    role? : UserRole,
}

//! UserSignupAction
export type UserSignupAction =
    | { type: "SET_NAME"; payload: string }
    | { type: "SET_EMAIL"; payload: string }
    | { type: "SET_PASSWORD"; payload: string }
    | { type: "SET_CONFIRM_PASSWORD"; payload: string }

//! ErrorState
export interface ErrorState {
    field?: string;
    message?: string;
}

//! UserStoreType
export interface UserStoreType {
    _id: string;
    name: string;
    email: string;
    role?: 'freelancer' | 'client' | 'admin' | 'none' | '';
    createdAt?: Date;
    isBlocked?:Boolean;
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
}

export type Role = "" | "freelancer" | "client" | "admin" | "none";

//! FreelancerDetail
export interface FreelancerDetail {
  _id: string
  name: string
  role: string
  profession: string
  company: string
  qualification: string
  bio: string
  work_experience: string
  profileSkills: string[]
  proficient_languages: string[]
  working_days: string
  active_hours: string
  portfolio: string
  rating: {
    average: number;
    count: number;
  }
  isSeller:string
}

//! InitialProjectDetail
export interface InitialProjectDetail {
    _id:string;
    title?: string;
    category?: string;
    pricing: {
        basic: { price: number, description: string, deliveryTime: number },
        standard: { price: number, description: string, deliveryTime: number },
        premium: { price: number, description: string, deliveryTime: number }
        };
    freelancer: {
      rating: {
        average: number;
        count: number;
      }
    }
    gallery:string[]
}

//! ProjectDetail
export interface ProjectDetail {
  _id?: string;
  title: string;
  description: string;
  category: string;
  freelancer?: Types.ObjectId;
  gallery: string[]
  isActive?: boolean
  pricing: {
    basic: { price: number, description: string, deliveryTime: number },
    standard?: { price: number, description: string, deliveryTime: number },
    premium?: { price: number, description: string, deliveryTime: number }
  }
  skills: string[]
}

//! OrderDetail
export interface OrderDetail {
  _id?: string;
  client?: {
    _id?: string
    name: string
  }
  freelancer?:{
    _id?: string
    name: string
  }
  gig?:{
    title: string
    pricing:{
      basic?:{
        price: number;
      }
    }
  }
  requirements: string;
  plan?: string;
  status?: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'DELIVERED' | 'COMPLETED' | 'REVISION' | 'REJECTED' | 'CANCELLED';
  deliveryFiles?: string[];
  deliveryNotes?: string;
  revisionReason?: string;
  revisionsRequested?: number;
  statusHistory?: [
    {changedBy?: string},
    {reason?: string},
    {status?: string},
    {timestamp?: Date}
  ],
  clientFeedback?: {
    rating: number;
    comment: string;
  }
  acceptedAt?: Date;
  startedAt?: Date;
  deliveredAt?: Date;
}

//! NotificationType
export interface NotificationType {
  _id: string;
  type: "new_order" | "order_completed" | "message" | "review";
  title: string;
  message: string;
  orderId?: string;
  gigTitle?: string;
  clientName?: string;
  createdAt: string;
  isRead: boolean;
}