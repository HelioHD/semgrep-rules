import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const allowedAlgorithms: jwt.Algorithm[] = ["HS256"];

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string, {
      algorithms: allowedAlgorithms,
    }) as { role?: string };
    if (decoded.role === "admin") {
      return next();
    }
  } catch {
    return res.status(401).send("invalid token");
  }
  return res.status(403).send("forbidden");
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET as string, {
    algorithms: allowedAlgorithms,
  });
}
