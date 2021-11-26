import { Field, ID, InputType, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from 'typeorm';
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

    @Field(type => Int)
    @Column()
    timeEstimation!: number;

    @Field(type => Int)
    @Column()
    timeSpent: number = 0;

    @Field(type => Int)
    @Column()
    percentageTimeSpent: number = 0;

    @Field(type => Int)
    @Column()
    percentageTaskAccomplished: number = 0;

    // TODO à supprimer
    @Field()
    @Column()
    dueDate: Date = new Date();

    @Field()
    @Column()
    isClosed!: boolean;

    @Field(() => User)
    @ManyToOne(() => User, user => user.projectsCreated)
    userAuthor: User; 

    // TODO à supprimer pour le tri
    @Field(() => [Ticket])
    @OneToMany(() => Ticket, ticket => ticket.id)
    ticketLinked: Ticket[];

    @Field(() => [User])
    @ManyToMany(() => User, user => user.projectsContribution)
    usersInProject: User[];
}

@InputType()
export class ProjectInputCreation {
    @Field()
    name!: string;

    @Field()
    isClosed!: boolean;

    // @Field(() => [User])
    // userInProject: User[];

    @Field(type => Int)
    timeEstimation : number;
}
