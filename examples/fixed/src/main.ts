import express from "express";
import session from "express-session";
import cors from "cors";
import { ValidationPipe } from "@nestjs/common";
import { searchUsers, goBack } from "./reports";

const allowedOrigins = ["https://app.example.com"];

export function createServer() {
  const app = express();

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    })
  );

  app.use(
    session({
      secret: process.env.SESSION_SECRET as string,
      cookie: { httpOnly: true, secure: true, sameSite: "lax" },
    })
  );

  const validationPipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });
  void validationPipe;

  app.get("/users", searchUsers);
  app.get("/go", goBack);

  return app;
}
