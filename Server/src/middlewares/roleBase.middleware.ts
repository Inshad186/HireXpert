import { Request, Response, NextFunction } from "express"
import { HttpStatus } from "@/constants/status.constant"


export const allowRoles = (...roles:string[]) => {
    return(req:Request, res:Response, next:NextFunction) => {
        const user = (req as any).user;
        console.log("User Roles ?????> >> : ",user.role)
        if(!user || !roles.includes(user.role)){
            res.status(HttpStatus.BAD_REQUEST).json({message : "User role is not found"})
            return 
        }
        next()
    }
}