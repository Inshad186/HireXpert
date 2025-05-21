import { Request, Response, NextFunction } from "express"

export interface IUserController {
    signup(req:Request, res:Response, next:NextFunction) : Promise<void>;
    login(req:Request, res:Response, next:NextFunction) : Promise<void>;
    verifyOtp(req:Request, res:Response, next:NextFunction) : Promise<void>;
    resendOtp(req:Request, res:Response, next:NextFunction) : Promise<void>;
    assignRole(req:Request, res:Response, next:NextFunction) : Promise<void>
    updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateUserName(req: Request, res: Response, next: NextFunction): Promise<void>;
    refreshToken(req:Request, res:Response, next:NextFunction) : Promise<void>
    getProfileImage(req:Request, res:Response, next:NextFunction) : Promise<void>
    getFreelancer(req:Request, res:Response, next:NextFunction) : Promise<void>
    logout(req:Request, res:Response, next:NextFunction) : Promise<void>;
}
