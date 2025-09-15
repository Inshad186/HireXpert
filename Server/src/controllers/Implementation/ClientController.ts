import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { IClientController } from "../Interface/IClientController";
import { IClientService } from "@/services/Interface/IClientService";

export class ClientController implements IClientController {
    constructor(private clientService : IClientService){}

    async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userData = req.body;
            const { userId } = JSON.parse(req.headers['x-user-payload'] as string);
            const updatedUser = await this.clientService.updateProfile(userId, userData);
            res.status(HttpStatus.OK).json({ success: true, userDetails : updatedUser });
        } catch (error) {
            next()
        }
    }

    async getGigs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const gigs = await this.clientService.getGigs()
            res.status(HttpStatus.OK).json({success: true, gigs})
        } catch (error) {
            next()
        }
    }

    async getProjectDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { projectId } = req.params
            console.log("PROJECT ID : > ",projectId)
            const projectDetails = await this.clientService.getGigDetails(projectId)
            console.log("PROJECT DETAILS ::: >",projectDetails)
            res.status(HttpStatus.OK).json({success:true, projectDetails})
        } catch (error) {
            next()
        }
    }
}