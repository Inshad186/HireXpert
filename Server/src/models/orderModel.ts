import mongoose, { Schema, Document } from "mongoose";

export enum OrderStatus {
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
  status: OrderStatus;
  timestamp: Date;
  changedBy: 'freelancer' | 'client';
  reason?: string; // for revisions
}

interface ClientFeedback {
  rating: number;
  comment: string;
  givenAt: Date;
}

interface OrderDocument extends Document {
  _id: mongoose.Types.ObjectId;
  client: mongoose.Types.ObjectId;
  freelancer: mongoose.Types.ObjectId;
  gig: mongoose.Types.ObjectId;
  price: number;
  deliveryTime: number;
  plan: "basic" | "standard" | "premium";
  requirements: string;
  status: OrderStatus;
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
    requirements: { type: String },
    status: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
    revisionsRequested: { type: Number, default: 0, max: 2 },
    revisionReason: { type: String },
    statusHistory: [
      {
        status: { type: String, enum: Object.values(OrderStatus)},
        timestamp: { type: Date, default: Date.now },
        changedBy: { type: String, enum: ["freelancer", "client"]},
        reason: { type: String }, // for revisions
      },
    ],

    // Key timestamps (ADDED for quick queries)
    acceptedAt: { type: Date },
    startedAt: { type: Date },
    deliveredAt: { type: Date },
    completedAt: { type: Date },

    // Delivery files (ADDED)
    deliveryFiles: [{ type: String }],
    
    clientFeedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      givenAt: { type: Date },
    },

    cancellationReason: { type: String },
    cancelledAt: { type: Date },
    cancelledBy: { type: String, enum: ["freelancer", "client"]},
  },
  { timestamps: true }
);

// Indexes for better query performance
orderSchema.index({ client: 1, status: 1 });
orderSchema.index({ freelancer: 1, status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });

export default mongoose.model<OrderDocument>("Order", orderSchema);