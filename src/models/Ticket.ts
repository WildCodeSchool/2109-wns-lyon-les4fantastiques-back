import { Field, ID, InputType, ObjectType } from 'type-graphql';
import { registerEnumType } from 'type-graphql/dist/decorators/enums';
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ECategory } from '../types';
import { Asset } from './Asset';
import { Comment } from './Comment';
import { Project } from './Project';
import { User } from './User';

// Nécessaire pour utiliser l'enum
registerEnumType(ECategory, {
    name: "ECategory",
  });

@ObjectType()
@Entity()
export class Ticket extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    title!: string;

    @Field()
    @Column()
    creationDate!: Date;

    @Field()
    @Column()
    description!: string;

    @Field()
    @Column()
    status!: string;

    @Field()
    @Column()
    timeSpent!: number;

    @Field()
    @Column()
    percentageAdvancement!: number;

    @Field()
    @Column()
    timeEstimation!: number;

    @Field()
    @Column()
    percentageTimeSpent!: number;

    @Field()
    @Column()
    category: ECategory = ECategory.BUG;

    @Field(() => Project)
    @ManyToOne(() => Project, project => project.id)
    projectLinkedId!: Project;

    @Field(() => User)
    @ManyToOne(() => User, user => user.ticketsCreated)
    userAuthorId!: User;

    // @Field(() => [Asset])
    // @OneToMany(() => Asset, asset => asset.ticketLinkedId)
    // assets: Asset[];

    @Field(() => [Comment])
    @ManyToOne(() => Comment, comment => comment.id)
    comments: Comment[];

    @Field(() => User)
    @ManyToOne(() => User, user => user.id)
    userAssignee: User;
}

@InputType()
export class TicketInputCreation {
    @Field()
    title!: string;

    @Field()
    description!: string;

    @Field()
    status!: string;

    @Field()
    timeEstimation!: number;

    @Field(() => Project)
    projectLinkedId!: Project;
}