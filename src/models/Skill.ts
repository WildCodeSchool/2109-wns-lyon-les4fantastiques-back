import { Field, ID, InputType, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Wilder } from "./Wilder";

@ObjectType('Skill')
@InputType('SkillInput')
@Entity()
export class Skill extends BaseEntity {
    @Field(() => ID, { nullable: true })
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    name!: string;

    @Field()
    @Column()
    votes!: number;

    @ManyToMany(() => Wilder, (wilder) => wilder.skills)
    wilders!: Wilder[];
}