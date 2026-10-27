import { Request, Response, NextFunction } from "express";

export interface IContactController {
  submitContact(req: Request, res: Response, next: NextFunction): Promise<void>;
  getContacts(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
}