import {
  Field,
  ID,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ERoleUserProject } from "../types/Enums/ERoleUserProject";
import { Lazy } from "../types/Lazy";
import { Ticket } from "./Ticket";
import { UserProject } from "./UserProject";

// Nécessaire pour utiliser l'enum
registerEnumType(ERoleUserProject, {
  name: "ERoleUserProject",
});

@ObjectType()
@Entity()
export class Project extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({
    length: 55,
  })
  name!: string;

  @Field()
  @Column()
  creationDate!: Date;

  @Field(() => Int)
  @Column()
  timeEstimation!: number;

  @Field(() => Int, { defaultValue: 0 })
  @Column({ default: 0 })
  timeSpent!: number;

  @Field()
  @Column({ default: true })
  isActive!: boolean;

  @Field(() => [UserProject], { defaultValue: [] })
  @OneToMany(() => UserProject, (userProject) => userProject.project, {
    lazy: true,
  })
  userProject!: Lazy<UserProject[]>;

  @Field(() => [Ticket])
  @OneToMany(() => Ticket, (ticket) => ticket.project, { lazy: true })
  tickets: Lazy<Ticket[]>;
}

@InputType()
export class ProjectInput {
  @Field()
  name!: string;

  @Field(() => Int)
  timeEstimation: number;
}

@InputType()
export class UpdateProjectInput {
  @Field()
  projectId: number;

  @Field({ nullable: true })
  productOwnerId?: number;

  @Field({ nullable: true })
  timeSpent?: number;

  @Field({ nullable: true })
  timeEstimation?: number;
}
