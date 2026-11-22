import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export async function searchUsers(req: Request, res: Response) {
  const email = (req.query.email as string) || "";
  const rows = await prisma.$queryRawUnsafe(
    `SELECT id, email FROM users WHERE email = '${email}'`
  );
  return res.json(rows);
}

export function goBack(req: Request, res: Response) {
  return res.redirect(req.query.next as string);
}
