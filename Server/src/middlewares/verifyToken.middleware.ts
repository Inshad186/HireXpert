import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/utils/jwt.util";
import { HttpResponse } from "@/constants/response.constant";
import { HttpStatus } from "@/constants/status.constant";

export default function (
  userLevel: "client" | "freelancer" | "admin"
): (req: Request, res: Response, next: NextFunction) => void | Response {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ error: HttpResponse.NO_TOKEN });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ error: HttpResponse.NO_TOKEN });
      }

      const payload = verifyToken(token) as {userId : string};

      req.headers["x-user-payload"] = JSON.stringify(payload);
      next();

    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ error: HttpResponse.TOKEN_EXPIRED });
      } else {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ error: HttpResponse.TOKEN_EXPIRED });
      }
    }
  };
}