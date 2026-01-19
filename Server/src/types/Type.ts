import { Document, Types } from "mongoose";

export interface UserType extends Document {
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
  stripeConnectedAccountId?: string;
  stripeOnboardingComplete?: boolean;
  isSeller: boolean;
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

// export interface OrderType {
//   _id: Types.ObjectId; 
//   client: Types.ObjectId;
//   freelancer: Types.ObjectId;
//   gig: Types.ObjectId;
//   requirements: string;
//   plan: string;
//   status: string;
//   createdAt?: Date;
//   updatedAt?: Date;
// } 

export interface NotificationType {
  id?: Types.ObjectId;
  orderId: Types.ObjectId;
  clientName: string;
  freelancer: Types.ObjectId;
  gigTitle: string;
  type: "new_order" | "order_completed" | "message" | "review"
  message: string;
  plan: string;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}


export enum OrderStatus {
  PAYMENT_PENDING = "PAYMENT_PENDING",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  IN_PROGRESS = "IN_PROGRESS",
  DELIVERED = "DELIVERED",
  COMPLETED = "COMPLETED",
  REVISION = "REVISION",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

interface StatusHistory {
  status: OrderStatus
  timestamp: Date;
  changedBy: 'freelancer' | 'client';
  reason?: string; // for revisions
}

interface ClientFeedback {
  rating: number;
  comment: string;
  givenAt: Date;
}

interface PaymentDetails {
  stripePaymentIntentId?: string;
  stripePlatformChargeId?: string;
  stripeTransferId?: string;
  amount?: number;
  currency?: string;
  status?: "PENDING" | "SUCCEEDED" | "PROCESSING" | "FAILED";
  paidAt?: Date;
  failureReason?: string;
}

interface EscrowDetails {
  holdUntilDate?: Date;
  escrowStatus?: "HELD" | "RELEASED" | "REFUNDED";
  releasedAt?: Date;
  releaseReason?: string;
}

export interface OrderType {
  _id: Types.ObjectId;
  client: Types.ObjectId;
  freelancer: Types.ObjectId;
  gig: Types.ObjectId;
  price?: number;
  deliveryTime?: number;
  plan: string
  requirements: string;
  status: OrderStatus
  revisionsRequested?: number;
  revisionReason?: string;
  statusHistory?: StatusHistory[];
  paymentDetails?: PaymentDetails;
  escrowDetails?: EscrowDetails;
  clientFeedback?: ClientFeedback;
  cancellationReason?: string;
  cancelledAt?: Date;
  cancelledBy?: string;
  acceptedAt?: Date;
  startedAt?: Date;
  deliveredAt?: Date;
  completedAt?: Date;
  deliveryFiles?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
