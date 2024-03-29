import { Length } from "class-validator";
import { Field, ID, InputType, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Lazy } from "../types/Lazy";
import { Comment } from "./Comment";
import { Picture } from "./Picture";
import { Project } from "./Project";
import { UserTicket } from "./UserTicket";

@ObjectType()
@Entity()
export class Ticket extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({
    length: 55,
  })
  name!: string;

  @Field()
  @Column({
    type: "text",
  })
  description!: string;

  @Field()
  @Column()
  creationDate!: Date;

  @Field()
  @Column()
  status: string;

  @Field()
  @Column()
  timeEstimation!: number;

  @Field(() => Int)
  @Column({ default: 0 })
  timeSpent!: number;

  @Field()
  @Column("boolean", { default: true })
  isActive!: boolean;

  @Field(() => Project)
  @ManyToOne(() => Project, (project) => project.tickets, { lazy: true })
  project!: Lazy<Project>;

  @Field(() => [UserTicket])
  @OneToMany(() => UserTicket, (userTicket) => userTicket.ticket, {
    lazy: true,
  })
  userTicket!: Lazy<UserTicket[]>;

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.ticket)
  comments: Comment;

  @Field(() => [Picture])
  @OneToMany(() => Picture, (picture) => picture.ticket, { lazy: true })
  pictures: Lazy<Picture[]>;
}

@InputType()
export class TicketInputCreation {
  @Field()
  @Length(3, 55)
  name!: string;

  @Field()
  description!: string;

  @Field()
  timeEstimation!: number;

  @Field()
  projectId!: number;

  @Field()
  status: string;
}

@InputType()
export class UpdateTicketInput {
  @Field()
  ticketId!: number;

  @Field({ nullable: true })
  timeSpent?: number;

  @Field({ nullable: true })
  timeEstimation?: number;

  @Field({ nullable: true })
  userAssignedId?: number;

  @Field({ nullable: true })
  status?: string;
}

@InputType()
export class TicketFiltersInput {
  @Field({ nullable: true })
  projectId?: number;

  @Field({ nullable: true })
  userAssignedId?: number;

  @Field({ nullable: true })
  authorId?: number;
}
