import jwt from "jsonwebtoken";

declare const token: string;
declare const res: any;

function inlineRole() {
  // ruleid: jwt-decode-as-auth
  if (jwt.decode(token).role === "admin") {
    return res.send("secret");
  }
}

function viaVariable() {
  // ruleid: jwt-decode-as-auth
  const decoded = jwt.decode(token);
  if (decoded.isAdmin) {
    return res.send("secret");
  }
}

function verifiedIsFine() {
  const decoded: any = jwt.verify(token, "secret", { algorithms: ["HS256"] });
  // ok: jwt-decode-as-auth
  if (decoded.role === "admin") {
    return res.send("ok");
  }
}

function decodeForLoggingOnly() {
  // ok: jwt-decode-as-auth
  const decoded: any = jwt.decode(token);
  console.log(decoded.iat);
}
