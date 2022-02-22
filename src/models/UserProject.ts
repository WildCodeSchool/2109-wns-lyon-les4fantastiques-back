import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Lazy } from "../types/Lazy";
import { ERoleUserProject } from "../types/ERolesEnum";
import { Project } from "./Project";
import { User } from "./User";

// Nécessaire pour utiliser l'enum
registerEnumType(ERoleUserProject, {
  name: "ERoleUserProject",
});

@ObjectType()
@Entity()
export class UserProject extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.userProject, { lazy: true })
  user: Lazy<User>;

  @Field(() => Project)
  @ManyToOne(() => Project, (project) => project.userProject, { lazy: true })
  project: Lazy<Project>;

  @Field(() => ERoleUserProject)
  @Column()
  role: ERoleUserProject;
}

@InputType()
export class AddUserToProjectInput {
  @Field()
  projectId!: number;

  @Field()
  userId!: number;

  @Field(() => ERoleUserProject)
  role!: ERoleUserProject;
}

@InputType()
export class UpdateUserProjectInput {
  @Field(() => ERoleUserProject)
  role!: ERoleUserProject;
}
