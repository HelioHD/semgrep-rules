import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  const decoded: any = jwt.decode(token);
  if (decoded.role === "admin") {
    return next();
  }
  return res.status(403).send("forbidden");
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET as string);
}
