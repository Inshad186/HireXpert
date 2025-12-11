import mongoose, { Schema, Document } from "mongoose"

interface INotification extends Document {
    freelancer: mongoose.Types.ObjectId;
    client: mongoose.Types.ObjectId;
    gig: mongoose.Types.ObjectId;
    type: "new_order" | "order_completed" | "message" | "review";
    message: string;
    plan: string;
    isRead: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const notificationSchema = new Schema<INotification>({

    freelancer: {type: Schema.Types.ObjectId, ref: "FreelancerProfile"},
    client: {type: Schema.Types.ObjectId, ref: "ClientProfile"},
    gig: {type: Schema.Types.ObjectId, ref: "Gig"},
    type: {type: String, enum: ["new_order", "order_completed", "message", "review"]},
    message: {type: String},
    plan: {type: String},
    isRead: {type: Boolean},
},{
    timestamps: true
});




export default mongoose.model<INotification>("Notification", notificationSchema);