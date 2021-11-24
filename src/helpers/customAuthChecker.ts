import { AuthChecker } from "type-graphql";
import { getRepository, OneToMany } from "typeorm";
import { User } from "../models/User";
import { ContextType } from "../types";
import { verifyToken } from "./auth/token";

export const customAuthChecker: AuthChecker<ContextType> = async ({ root, args, context, info }, roles) => {
  // here we can read the user from context
  try {
    const userRepo = getRepository(User);

    if (!context.token) return false;

    // On récupère le token depuis le header de la requete et on le slice pour enlever le "Bearer"
    const token = context.token.slice(7);
    // On décode le token
    const decodedToken = verifyToken(token);
    // On récupère l'utilisateur lié à l'id présent dans le token décodé
    const user = await userRepo.findOne(decodedToken.userId);

    if (!user) return false;
    // On place notre user dans le context
    context.user = user;
    // On return true dans le cas où l'utilisateur possède bien les roles nécessaires
    return roles.length !== 0 ? roles.includes(context.user.role) : true;
  } catch {
    return false;
  }
};
