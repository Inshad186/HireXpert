import { Request, Response, NextFunction } from "express";
import { HttpResponse } from "@/constants/response.constant";
import { HttpStatus } from "@/constants/status.constant";
import { env } from "@/config/env.config";
import jwt from 'jsonwebtoken';

export async function verifyTokenMiddleware(req: Request, res: Response, next: NextFunction):Promise<void>{
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer")) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: HttpResponse.NO_TOKEN });
        return
      }

      const token = authHeader.split(" ")[1];
      console.log("token ??? >>>> ", token)
      if (!token) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: HttpResponse.NO_TOKEN });
        return
      }

      const payload = jwt.verify(token, env.JWT_ACCESS_SECRET as string) as { userId: string; role: string };
      (req as any).user = {
      id: payload.userId,
      role: payload.role,
    };
      console.log("PAYLOAD >>>>>>>>> : ",payload)

      req.headers["x-user-payload"] = JSON.stringify(payload);
      next();

    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        res.status(HttpStatus.FORBIDDEN).json({ error: HttpResponse.TOKEN_EXPIRED });
        return
      } else {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: HttpResponse.TOKEN_EXPIRED });
        return
      }
    }
  };