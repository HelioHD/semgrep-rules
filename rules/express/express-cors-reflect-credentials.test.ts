import cors from "cors";
import express from "express";

const app = express();

// ruleid: express-cors-reflect-credentials
app.use(cors({ origin: true, credentials: true }));

// ruleid: express-cors-reflect-credentials
const reflectingCors = cors({
  credentials: true,
  origin: function (origin, callback) {
    callback(null, origin);
  },
});
app.use(reflectingCors);

// ok: express-cors-reflect-credentials
app.use(cors({ origin: "https://app.example.com", credentials: true }));

// ok: express-cors-reflect-credentials
app.use(cors({ origin: true }));
