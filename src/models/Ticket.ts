import { Field, ID, InputType, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Asset } from './Asset';
import { Comment } from './Comment';
import { Project } from './Project';
import { User } from './User';

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
    category!: string;

    @Field()
    @ManyToOne(() => Project, project => project.id)
    projectLinkedID!: number;

    @Field()
    @Column()
    userAssignedID!: number;

    @Field()
    @ManyToOne(() => User, user => user.id)
    userAuthorID!: number; // ou User ??

    @Field(() => Asset)
    @OneToMany(() => Asset, asset => asset.ticketId)
    asset: Asset[];

    @Field()
    @ManyToOne(() => Comment, comment => comment.id)
    comments: Comment[];

    @Field()
    @ManyToOne(() => User, user => user.id)
    userAssignee: number; //ou User ?
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

    @Field()
    category!: string;

    @Field()
    project_linked!: number;
}