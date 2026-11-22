import { PrismaClient, Prisma } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export async function searchUsers(req: Request, res: Response) {
  const email = (req.query.email as string) || "";
  const rows = await prisma.$queryRaw(
    Prisma.sql`SELECT id, email FROM "User" WHERE email = ${email}`
  );
  return res.json(rows);
}

const allowedRedirects = new Set(["/dashboard", "/orders"]);

export function goBack(req: Request, res: Response) {
  const next = (req.query.next as string) || "/dashboard";
  const target = allowedRedirects.has(next) ? next : "/dashboard";
  return res.redirect(target);
}
