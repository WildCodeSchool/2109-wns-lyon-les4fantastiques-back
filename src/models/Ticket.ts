import { Field, ID, InputType, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Asset } from './Asset';
import { Comment } from './Comment';

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
    @Column()
    projectLinkedID!: number;

    @Field()
    @Column()
    userAssignedID!: number;

    @Field()
    @Column()
    userAuthorID!: number;

    @Field(() => Asset)
    @OneToMany(() => Asset, asset => asset.ticketId)
    asset: Asset[];

    @Field()
    @ManyToOne(() => Comment, comment => comment.id)
    commentId: number;
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