import mongoose, { Schema, Document } from "mongoose";

export interface UserType extends Document {
    name: string;
    email: string;
    password?: string;
    role?: 'freelancer' | 'client' | 'admin';
    isBlocked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema: Schema = new Schema<UserType>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ["freelancer", "client", "admin", "none"],
        default : "none"
    },
    isBlocked: {
        type : Boolean,
        default: false
    },
}, { timestamps: true })

export default mongoose.model<UserType>("User", userSchema)