import session from "express-session";
import express from "express";

const app = express();

// ruleid: cookie-session-insecure
app.use(session({ secret: "s", cookie: { httpOnly: true } }));

declare const res: any;

// ruleid: cookie-session-insecure
res.cookie("sid", "abc", { httpOnly: true, secure: true });

// ok: cookie-session-insecure
app.use(
  session({ secret: "s", cookie: { httpOnly: true, secure: true, sameSite: "lax" } })
);

// ok: cookie-session-insecure
res.cookie("sid", "abc", { httpOnly: true, secure: true, sameSite: "strict" });
