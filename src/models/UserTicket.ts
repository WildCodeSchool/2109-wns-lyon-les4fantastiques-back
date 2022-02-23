import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Lazy } from "../types/Lazy";
import { ERoleUserTicket } from "../types/Enums/ERolesTicket";
import { Ticket } from "./Ticket";
import { User } from "./User";

registerEnumType(ERoleUserTicket, {
  name: "ERoleUserTicket",
});
@ObjectType()
@Entity()
export class UserTicket extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.userTicket, { lazy: true })
  user!: Lazy<User>;

  @Field(() => Ticket)
  @ManyToOne(() => Ticket, (ticket) => ticket.userTicket, { lazy: true })
  ticket!: Lazy<Ticket>;

  @Field(() => ERoleUserTicket, { defaultValue: ERoleUserTicket.AUTHOR })
  @Column({ default: ERoleUserTicket.AUTHOR })
  role!: ERoleUserTicket;
}
