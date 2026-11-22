import express from "express";
import session from "express-session";
import cors from "cors";
import { ValidationPipe } from "@nestjs/common";
import { searchUsers, goBack } from "./reports";

export function createServer() {
  const app = express();

  app.use(cors({ origin: true, credentials: true }));

  app.use(
    session({
      secret: process.env.SESSION_SECRET as string,
      cookie: { httpOnly: true },
    })
  );

  const validationPipe = new ValidationPipe({ transform: true });
  void validationPipe;

  app.get("/users", searchUsers);
  app.get("/go", goBack);

  return app;
}
