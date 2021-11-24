import { Arg, Authorized, Ctx, Field, ID, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { User, UserInputSignUp } from "../models/User";
import * as argon2 from "argon2";
import { generateToken } from "../helpers/auth/token";
import { ERole } from "../types";

@Resolver(User)
export class UsersResolver {
  private userRepo = getRepository(User);

  @Authorized("ADMIN")
  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return await this.userRepo.find();
  }

  @Mutation(() => User)
  async signup(@Arg("data", () => UserInputSignUp) user: UserInputSignUp): Promise<User> {
    const newUser = this.userRepo.create(user);
    await newUser.save();
    return newUser;
  }

  @Authorized()
  @Query(() => User)
  async getSignedInUser(@Ctx() context: { user: User }): Promise<User> {
    const user = context.user;
    return await this.userRepo.findOne(user.id);
  }

  @Mutation(() => String, { nullable: true })
  async signin(@Arg("email") email: string, @Arg("password") password: string): Promise<string> {
    const user = await this.userRepo.findOne({ email });
    if (user) {
      if (await argon2.verify(user.password, password)) {
        const token = generateToken(user.id);
        return token && token;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

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
