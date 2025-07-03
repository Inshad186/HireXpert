import { Request, Response, NextFunction } from "express";

export interface IClientController {
    updateProfile(req:Request, res:Response, next:NextFunction) : Promise<void>
}