import { Field, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { ERoleUserProject } from "../types/ERolesEnum";
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

  @Field(() => Int)
  @Column()
  timeSpent: number = 0;

  @Field()
  @Column()
  isClosed!: boolean;

  @Field(() => [UserProject], { defaultValue: [] })
  @OneToMany(() => UserProject, (userProject) => userProject.project, { lazy: true })
  userProject!: Promise<UserProject[]>;

  @Field(() => [Ticket])
  @OneToMany(() => Ticket, (ticket) => ticket.project, { lazy: true })
  tickets: Promise<Ticket[]>;
}

@InputType()
export class ProjectInputCreation {
  @Field()
  name!: string;

  @Field()
  isClosed!: boolean;

  @Field(() => Int)
  timeEstimation: number;
}

@InputType()
export class updateProject {
  @Field()
  projectId: number;

  @Field({ nullable: true })
  productOwnerId?: number;

  @Field({ nullable: true })
  timeSpent?: number;

  @Field({ nullable: true })
  timeEstimation?: number;
}
