import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const { JWT_SECRET } = process.env;

export const generateToken = (payload, expiresIn = "10d") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
