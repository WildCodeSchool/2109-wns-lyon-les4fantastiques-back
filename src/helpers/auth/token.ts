import * as jwt from "jsonwebtoken";

require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;
export const generateToken = (userId: number): string => {
  return jwt.sign({ userId: userId }, privateKey);
};

export const verifyToken = (userToken: string): { userId: string } => {
  return jwt.verify(userToken, privateKey) as { userId: string };
};
