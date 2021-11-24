import * as jwt from "jsonwebtoken";

const privateKey = "supersecret123";
export const generateToken = (userId: number): string => {
  return jwt.sign({ id: userId }, privateKey);
};

export const verifyToken = (userToken: string): { userId: string } => {
  return jwt.verify(userToken, privateKey) as unknown as { userId: string };
};
