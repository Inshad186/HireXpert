import { Request, Response, NextFunction } from "express";
import { HttpResponse } from "@/constants/response.constant";
import { HttpError } from "./http-error.util";

export const asyncHandler = (fn: Function) => {
    return async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await fn(req, res, next);
        } catch (err) {
            if (err instanceof HttpError) {
                res.status(err.statusCode).json({ error: err.message });
            } else {
                res.status(500).json({ error: HttpResponse.SERVER_ERROR });
            }
        }
    };
};