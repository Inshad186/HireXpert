import mongoose, { Schema } from "mongoose";
import { UserType } from "@/types/Type";

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
    profilePicture: {
        type: String,
        default: ""
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