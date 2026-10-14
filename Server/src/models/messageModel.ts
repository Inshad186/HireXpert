import mongoose, {Schema, Document} from "mongoose"

interface IMessage extends Document{
    _id: mongoose.Types.ObjectId,
    orderId: mongoose.Types.ObjectId,
    senderId: mongoose.Types.ObjectId,
    senderName: string,
    senderImage: string,
    recipientId: mongoose.Types.ObjectId,
    content: string,
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
    orderId: {type: Schema.Types.ObjectId, ref: "Order"},
    senderId: {type: Schema.Types.ObjectId},
    senderName: {type: String},
    senderImage: {type: String},
    recipientId: {type: Schema.Types.ObjectId},
    content: {type: String},
    read: {type: Boolean, default: false}
},
{timestamps: true})

export default mongoose.model<IMessage>("Message", messageSchema)