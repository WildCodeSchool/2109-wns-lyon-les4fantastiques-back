import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { User, UserInputSignUp } from "../models/User";
import * as argon2 from 'argon2';

@Resolver(User)
export class UsersResolver {
    private userRepo = getRepository(User);

    @Query(() => [User])
    async getUsers(): Promise<User[]> {
        return await this.userRepo.find();
    }

    @Mutation(() => User)
    async signup(@Arg('data', () => UserInputSignUp) user: UserInputSignUp): Promise<User> {
        const newUser = this.userRepo.create(user);
        await newUser.save();
        return newUser;
    }

    @Mutation(() => User, { nullable: true })
    async signin(@Arg('email') email: string, @Arg('password') password: string): Promise<User> {
        const user = await this.userRepo.findOne({ email });

        if(user) {
            if(await argon2.verify(user.password, password)) {
                return user;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    @Mutation(() => User, { nullable: true })
    async deleteUser(@Arg('id', () => ID) id: number): Promise<User | null> {
        const user = await this.userRepo.findOne(id);
        if (user) {
            await user.remove();
        }
        return user;
    }
}