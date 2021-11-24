import { Field, ID, InputType, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Ticket } from './Ticket';
import { User } from './User';

@ObjectType()
@Entity()
export class Notification extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({
        length: 100
    })
    message!: string;

    @Field()
    @Column()
    creationDate!: Date;

    @Field()
    @Column()
    isRead!: boolean;

    @Field()
    @OneToMany(() => User, user => user.id)
    UseriD!: number;

    @Field()
    @OneToMany(() => Ticket, ticket => ticket.id)
    TicketiD!: number;
}

@InputType()
export class NotificationInputCreation {
    @Field()
    message!: string;

    @Field()
    creationDate!: Date;

    @Field()
    isRead!: boolean;

    @Field()
    UseriD!: number;

    @Field()
    TicketiD!: number;
}