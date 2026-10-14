import mongoose, { Schema, Document } from "mongoose"

interface INotification extends Document {
    freelancer: mongoose.Types.ObjectId;
    client?: mongoose.Types.ObjectId;
    orderId: mongoose.Types.ObjectId;
    clientName: string;
    gigTitle: string;
    type: "new_order" | "order_completed" | "message" | "review" | "work_delivered" | "revision_requested";
    message: string;
    plan: string;
    isRead: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const notificationSchema = new Schema<INotification>({
    freelancer: {type: Schema.Types.ObjectId, ref: "FreelancerProfile"},
    client: { type: Schema.Types.ObjectId, ref: "ClientProfile" },
    orderId: {type: Schema.Types.ObjectId, ref: "Order"},
    clientName: {type: String},
    gigTitle: {type: String},
    type: { type: String, enum: ["new_order", "order_completed", "message", "review", "work_delivered", "revision_requested"] },
    message: {type: String},
    plan: {type: String},
    isRead: { type: Boolean, default: false },
},{
    timestamps: true
});

export default mongoose.model<INotification>("Notification", notificationSchema);