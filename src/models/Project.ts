import { Field, ID, InputType, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from 'typeorm';
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

    @Field()
    @Column()
    isClosed!: boolean;

    @Field(() => User)
    @ManyToOne(() => User, user => user.projectsCreated)
    userAuthor: User; 

}

@InputType()
export class ProjectInputCreation {
    @Field()
    name!: string;

    @Field()
    isClosed!: boolean;

    @Field(type => Int)
    timeEstimation : number;
}
