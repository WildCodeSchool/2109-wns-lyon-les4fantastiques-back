import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Ticket } from "./Ticket";

@ObjectType()
@Entity()
export class Picture extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  contentUrl!: string;

  @Field(() => Ticket)
  @ManyToOne(() => Ticket, (ticket) => ticket.pictures)
  ticket!: Ticket;
}
