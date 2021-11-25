import { Field, ID, InputType, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Ticket } from './Ticket';
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

    @Field(() => User)
    @ManyToOne(() => User, user => user.id)
    userAuthorId: User; 

    @Field(() => Ticket)
    @OneToMany(() => Ticket, ticket => ticket.id)
    ticketLinked: Ticket[];

    @Field(() => User)
    @ManyToMany(() => User, user => user.id)
    userInProject: User[];
}

@InputType()
export class ProjectInputCreation {
    @Field()
    name!: string;

    @Field()
    isClosed!: boolean;

    @Field(() => User)
    userAuthorId!: User;

    @Field(() => User)
    userInProject: User[];
}
