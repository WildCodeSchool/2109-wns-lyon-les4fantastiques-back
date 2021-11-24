import { Field, ID, InputType, ObjectType, registerEnumType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ERole } from "../types";

// Nécessaire pour utiliser l'enum
registerEnumType(ERole, {
  name: "ERole",
});

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  firstname!: string;

  @Field()
  @Column()
  lastname!: string;

  @Field()
  @Column()
  email!: string;

  @Field()
  @Column()
  password!: string;

  @Field(() => ERole)
  @Column()
  role: ERole = ERole.DEV;
}

@InputType()
export class UserInputSignUp {
  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field()
  @Column()
  firstname!: string;

  @Field()
  @Column()
  lastname!: string;
}
