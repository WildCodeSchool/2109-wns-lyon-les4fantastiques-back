import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { getRepository } from "typeorm";
import { User, UserInputSignIn, UserInputSignUp } from "../models/User";
import * as argon2 from "argon2";
import { generateToken } from "../helpers/auth/token";
import { ERole } from "../types/Enums/Erole";

@Resolver(User)
export class UsersResolver {
  private userRepo = getRepository(User);

  // QUERIES

  // Get de tous les users
  @Authorized("ADMIN")
  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return await this.userRepo.find();
  }

  // Get de l'utilisateur connecté
  @Authorized()
  @Query(() => User)
  async getSignedInUser(@Ctx() context: { user: User }): Promise<User> {
    const user = context.user;
    return await this.userRepo.findOne(user.id, { relations: ["userProject"] });
  }

  // MUTATIONS

  // Inscription
  @Mutation(() => User)
  async signup(
    @Arg("data", () => UserInputSignUp) userInputSignUp: UserInputSignUp,
  ): Promise<User> {
    const newUser = this.userRepo.create(userInputSignUp);
    newUser.password = await argon2.hash(newUser.password);
    await newUser.save();
    return newUser;
  }

  // Connexion
  @Mutation(() => String, { nullable: true })
  async signin(
    @Arg("data", () => UserInputSignIn) userInputSignIn: UserInputSignIn,
  ): Promise<string> {
    const userToSignIn = await this.userRepo.findOne({
      email: userInputSignIn.email,
    });
    if (userToSignIn) {
      if (
        await argon2.verify(userToSignIn.password, userInputSignIn.password)
      ) {
        const token = generateToken(userToSignIn.id);
        return token && token;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  // Role update
  @Authorized("ADMIN")
  @Mutation(() => User)
  async updateRole(
    @Arg("id", () => ID) id: number,
    @Arg("role", () => String) role: string,
  ): Promise<User | null> {
    const userToUpdate = await this.userRepo.findOne(id);
    if (userToUpdate) {
      userToUpdate.role = role as ERole;
    }
    userToUpdate.save();
    return userToUpdate;
  }

  // Suppression d'un utilisateur
  @Authorized("ADMIN")
  @Mutation(() => User, { nullable: true })
  async deleteUser(@Arg("id", () => ID) id: number): Promise<User | null> {
    const user = await this.userRepo.findOne(id);
    if (user) {
      await user.remove();
    }
    return user;
  }
}
