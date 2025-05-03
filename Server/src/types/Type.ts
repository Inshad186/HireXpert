import { ObjectId } from "mongoose";

export interface UserType {
    _id?: ObjectId;
    name?: string;
    email: string;
    password?: string;
    role?: 'freelancer' | 'client' | 'admin';
    isBlocked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}