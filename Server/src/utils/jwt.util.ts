import jwt from 'jsonwebtoken';
import { env } from '../config/env.config';
import { ObjectId } from 'mongoose';

export const generateRefreshToken =(userId : ObjectId, role:string)=> {
    return jwt.sign(
        {userId, role},
        env.JWT_REFRESH_SECRET as string,
        {expiresIn: '7d'}
    )
} 

export const generateAccessToken=(userId : ObjectId, role:string)=>{
    return jwt.sign(
        {userId, role},
        env.JWT_ACCESS_SECRET as string,
        {expiresIn: '15m'}
    )
}

export const verifyToken = (token: string) => {
    try {
      const decoded = jwt.verify(token,env.JWT_REFRESH_SECRET as string) as { userId: string; role: string };
      console.log("Decoded Token : ",decoded)
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      throw error;
    }
};