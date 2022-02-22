import { Field, ID, InputType, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Ticket } from "./Ticket";
import { Lazy } from "../types/Lazy";

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  content: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments, { lazy: true })
  author: Lazy<User>;

  @Field(() => Ticket)
  @ManyToOne(() => Ticket, (ticket) => ticket.comments, { lazy: true })
  ticket: Lazy<Ticket>;
}

@InputType()
export class CommentInput {
  @Field()
  ticketId: number;

  @Field()
  content: string;
}

@InputType()
export class UpdateCommentInput {
  @Field()
  commentId: number;

  @Field()
  content: string;
}
