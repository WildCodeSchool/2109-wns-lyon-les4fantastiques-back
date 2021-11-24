import { Field, ID, InputType, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Asset } from './Asset';
import { Ticket } from './Ticket';
import { User } from './User';

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({
        length: 100
    })
    description!: string;

    @Field()
    @Column()
    creationDate!: Date;

    @Field()
    @OneToMany(() => Ticket, ticket => ticket.id)
    ticketLinkedId: number;

    @Field()
    @ManyToOne(() => User, user => user.id)
    userAuthorId: number;
}

@InputType()
export class CommentInputCreation {
    @Field()
    description!: string;

    @Field()
    ticketLinkedId: number;

    @Field()
    userAuthorId: number;
}