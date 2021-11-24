import { Field, ID, InputType, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity()
export class Project extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({
        length: 55
    })
    name!: string;

    @Field()
    @Column()
    creationDate!: Date;

    @Field()
    @Column()
    timeEstimation!: number;

    @Field()
    @Column()
    timeSpent!: number;

    @Field()
    @Column()
    percentageTimeSpent!: number;

    @Field()
    @Column()
    percentageTaskAccomplished!: number;

    @Field()
    @Column()
    dueDate!: Date;

    @Field()
    @Column()
    isClosed!: boolean;

    @Field()
    @Column()
    UserId!: number;

    // @Field()
    // @ManyToOne(() => User, user => user.projects)
    // user: User;

}

@InputType()
export class ProjectInputCreation {
    @Field()
    name!: string;

    @Field()
    timeEstimation!: number;

    @Field()
    dueDate!: Date;

    @Field()
    isClosed!: boolean;

    @Field()
    UserId!: number;

}

// TODO tableau d'User 
