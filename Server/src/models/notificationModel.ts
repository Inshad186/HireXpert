import mongoose, { Schema, Document } from "mongoose"

interface INotification extends Document {
    freelancer: mongoose.Types.ObjectId;
    orderId: mongoose.Types.ObjectId;
    clientName: string;
    gigTitle: string;
    type: "new_order" | "order_completed" | "message" | "review";
    message: string;
    plan: string;
    isRead: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const notificationSchema = new Schema<INotification>({

    freelancer: {type: Schema.Types.ObjectId, ref: "FreelancerProfile"},
    orderId: {type: Schema.Types.ObjectId, ref: "Order"},
    clientName: {type: String},
    gigTitle: {type: String},
    type: {type: String, enum: ["new_order", "order_completed", "message", "review"]},
    message: {type: String},
    plan: {type: String},
    isRead: {type: Boolean},
},{
    timestamps: true
});

export default mongoose.model<INotification>("Notification", notificationSchema);