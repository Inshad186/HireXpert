import { Request, Response, NextFunction } from "express";

export interface IFreelancerController {
    updateProfile(req:Request, res:Response, next:NextFunction) : Promise<void>
    createGig(req:Request, res:Response, next:NextFunction) : Promise<void>
    getGigList(req:Request, res:Response, next:NextFunction) : Promise<void>
    updateGigStatus(req:Request, res:Response, next:NextFunction) : Promise<void>
}