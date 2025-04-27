import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";

export const authMiddleware = ( validationSchema: Record<string, { rules: RegExp[]; messages: string[]; optional?: boolean }>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        for (const field in validationSchema) {
            const { rules, messages, optional } = validationSchema[field];
            const value = req.body[field];

            if (!value) {
                if (optional) continue;
                res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.INVALID_CREDENTIALS });
                return;
            }

            for (let i = 0; i < rules.length; i++) {
                if (!rules[i].test(value)) {
                    res.status(HttpStatus.BAD_REQUEST).json({ error: messages[i] });
                    return;
                }
            }
        }
        next();
    };
};
