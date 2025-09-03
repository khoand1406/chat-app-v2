import jwt from "jsonwebtoken";
import JWTPayload from "../interfaces/jwtPayload";

export function verifyJWT(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
  } catch (err) {
    return null;
  }
}