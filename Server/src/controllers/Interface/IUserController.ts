import { Request, Response, NextFunction } from "express"

export interface IUserController {
    signup(req:Request, res:Response, next:NextFunction) : Promise<void>
}