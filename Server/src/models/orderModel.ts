import mongoose, { Schema, Document } from "mongoose";

export enum OrderStatus {
  PAYMENT_PENDING = "PAYMENT_PENDING",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  IN_PROGRESS = "IN_PROGRESS",
  DELIVERED = "DELIVERED",
  COMPLETED = "COMPLETED",
  REVISION = "REVISION",
  DISPUTED = "DISPUTED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

interface PaymentDetails {
  stripePaymentIntentId: string;
  stripePlatformChargeId?: string;
  stripeTransferId?: string;
  amount: number;
  platformFee?: number;
  freelancerAmount?: number;
  currency: string;
  status: "PENDING" | "SUCCEEDED" | "PROCESSING" | "FAILED";
  paidAt?: Date;
  failureReason?: string;
}

interface EscrowDetails {
  holdUntilDate: Date;
  escrowStatus: "HELD" | "RELEASED" | "REFUNDED";
  releasedAt?: Date;
  releaseReason?: string;
}

export type Actor = "freelancer" | "client" | "system" | "admin";

interface StatusHistory {
  status: OrderStatus;
  timestamp: Date;
  changedBy: Actor
  reason?: string;
}

interface ClientFeedback {
  rating: number;
  feedback: string;
  givenAt: Date;
}

interface OrderDocument extends Document {
  _id: mongoose.Types.ObjectId;
  client: mongoose.Types.ObjectId;
  freelancer: mongoose.Types.ObjectId;
  gig: mongoose.Types.ObjectId;
  price: number;
  deliveryTime: number;
  deliveryNotes?: string;
  plan: "basic" | "standard" | "premium";
  requirements: string;
  status: OrderStatus;
  paymentDetails?: PaymentDetails;
  escrowDetails?: EscrowDetails;
  revisionsRequested: number;
  revisionReason?: string;
  statusHistory: StatusHistory[];
  clientFeedback?: ClientFeedback;
  cancellationReason?: string;
  cancelledAt?: Date;
  cancelledBy?: string;
  
  // Key timestamps for quick access (ADDED)
  acceptedAt?: Date;
  startedAt?: Date;
  deliveredAt?: Date;
  completedAt?: Date;
  
  // Delivery files (ADDED)
  deliveryFiles?: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<OrderDocument>(
  {
    client: { type: Schema.Types.ObjectId, ref: "ClientProfile" },
    freelancer: { type: Schema.Types.ObjectId, ref: "FreelancerProfile" },
    gig: { type: Schema.Types.ObjectId, ref: "Gig" },

    plan: {  type: String,  enum: ["basic", "standard", "premium"]},
    price: { type: Number },
    deliveryTime: { type: Number },
    deliveryNotes: { type: String },
    requirements: { type: String },
    status: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
    revisionsRequested: { type: Number, default: 0, max: 2 },
    revisionReason: { type: String },
    statusHistory: [
      {
        status: { type: String, enum: Object.values(OrderStatus)},
        timestamp: { type: Date, default: Date.now },
        changedBy: { type: String, enum: ["freelancer", "client", "system", "admin"]},
        reason: { type: String }
      },
    ],
    paymentDetails: {
      stripePaymentIntentId: { type: String },
      stripePlatformChargeId: { type: String },
      stripeTransferId: { type: String },
      amount: { type: Number },
      platformFee: {type: Number},
      freelancerAmount: {type: Number },
      currency: { type: String, default: "inr" },
      status: { 
        type: String, 
        enum: ["PENDING", "SUCCEEDED", "PROCESSING", "FAILED"],
        default: "PENDING" 
      },
      paidAt: { type: Date },
      failureReason: { type: String },
    },

    escrowDetails: {
      holdUntilDate: { type: Date },
      escrowStatus: { type: String, enum: ["HELD", "RELEASED", "REFUNDED"]},
      releasedAt: { type: Date },
      releaseReason: { type: String },
    },

    // Key timestamps (ADDED for quick queries)
    acceptedAt: { type: Date },
    startedAt: { type: Date },
    deliveredAt: { type: Date },
    completedAt: { type: Date },

    // Delivery files (ADDED)
    deliveryFiles: [{ type: String }],
    
    clientFeedback: {
      rating: { type: Number, min: 1, max: 5 },
      feedback: { type: String },
      givenAt: { type: Date },
    },

    cancellationReason: { type: String },
    cancelledAt: { type: Date },
    cancelledBy: { type: String, enum: ["freelancer", "client", "system", "admin"]},
  },
  { timestamps: true }
);

// Indexes for better query performance
orderSchema.index({ client: 1, status: 1 });
orderSchema.index({ freelancer: 1, status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ status: 1, "escrowDetails.escrowStatus": 1, "escrowDetails.holdUntilDate": 1 });
orderSchema.index({ "paymentDetails.stripePaymentIntentId": 1 }, { unique: true, sparse: true });

export default mongoose.model<OrderDocument>("Order", orderSchema);