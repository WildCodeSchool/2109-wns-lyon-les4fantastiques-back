import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { Skill } from "../models/Skill";
import { Wilder, WilderInput } from "../models/Wilder";

@Resolver(Wilder)
export class WildersResolver {
    private wilderRepo = getRepository(Wilder);
    private skillRepo = getRepository(Skill);

    @Query(() => [Wilder])
    async getWilders(): Promise<Wilder[]> {
        return await this.wilderRepo.find({ relations: ['skills'] });
    }

    @Mutation(() => Wilder)
    async addWilder(@Arg('data', () => WilderInput) wilder: WilderInput): Promise<Wilder> {
        const newWilder = this.wilderRepo.create(wilder);

        for (const [index, skill] of wilder.skills.entries()) {
            const dbSkill = skill.id
                ? await this.skillRepo.findOne(skill.id)
                : await this.skillRepo.create(skill);
            await dbSkill.save();
            newWilder.skills[index] = dbSkill;
        }

        await newWilder.save();
        return newWilder;
    }

    @Mutation(() => Wilder, { nullable: true })
    async deleteWilder(@Arg('id', () => ID) id: number): Promise<Wilder | null> {
        const wilder = await this.wilderRepo.findOne(id);
        if (wilder) {
            await wilder.remove();
        }
        return wilder;
    }
}