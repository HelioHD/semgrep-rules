import jwt from "jsonwebtoken";

declare const token: string;
declare const key: string;

function noAlgorithms() {
  // ruleid: jwt-verify-no-algorithms
  return jwt.verify(token, key);
}

function callbackNoAlgorithms() {
  // ruleid: jwt-verify-no-algorithms
  jwt.verify(token, key, (err: any, decoded: any) => decoded);
}

function withAlgorithms() {
  // ok: jwt-verify-no-algorithms
  return jwt.verify(token, key, { algorithms: ["HS256"] });
}

function withAlgorithmsAndCallback() {
  // ok: jwt-verify-no-algorithms
  jwt.verify(token, key, { algorithms: ["RS256"] }, (err: any, decoded: any) => decoded);
}
