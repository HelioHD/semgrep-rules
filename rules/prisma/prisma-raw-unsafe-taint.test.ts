import { Prisma } from "@prisma/client";

declare const prisma: any;
declare const req: any;

async function direct() {
  // ruleid: prisma-raw-unsafe-taint
  await prisma.$queryRawUnsafe(`SELECT * FROM users WHERE email = '${req.body.email}'`);
}

async function throughVariable() {
  const q = "SELECT * FROM users WHERE id = " + req.params.id;
  // ruleid: prisma-raw-unsafe-taint
  await prisma.$queryRawUnsafe(q);
}

async function executeUnsafe() {
  // ruleid: prisma-raw-unsafe-taint
  await prisma.$executeRawUnsafe(`DELETE FROM users WHERE name = '${req.query.name}'`);
}

async function prismaRaw() {
  // ruleid: prisma-raw-unsafe-taint
  await prisma.$queryRaw(Prisma.raw(`SELECT * FROM t WHERE a = ${req.body.a}`));
}

async function safeParam() {
  // ok: prisma-raw-unsafe-taint
  await prisma.$queryRawUnsafe("SELECT * FROM users WHERE email = $1", req.body.email);
}

async function safeTagged() {
  // ok: prisma-raw-unsafe-taint
  await prisma.$queryRaw`SELECT * FROM users WHERE email = ${req.body.email}`;
}

async function safeConstant() {
  // ok: prisma-raw-unsafe-taint
  await prisma.$queryRawUnsafe("SELECT * FROM users");
}
