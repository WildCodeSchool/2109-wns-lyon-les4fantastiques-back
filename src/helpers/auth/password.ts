import * as argon2 from "argon2";

export const hashPassword = (plainPassword: string) => {
  return argon2.hash(plainPassword);
};
export const verifyPassword = (
  plainPassword: string,
  hashedPassword: string,
) => {
  return argon2.verify(hashedPassword, plainPassword);
};
