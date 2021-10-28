import { Field, ID, InputType, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Skill } from './Skill';

@ObjectType()
@Entity()
export class Wilder extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    name!: string;

    @Field()
    @Column()
    city!: string;

    @Field(() => [Skill])
    @ManyToMany(() => Skill, (skill) => skill.wilders)
    skills!: Skill[];
}

@InputType()
export class WilderInput {
    @Field()
    name!: string;

    @Field()
    city!: string;

    @Field(() => [Skill])
    skills!: Skill[];
}