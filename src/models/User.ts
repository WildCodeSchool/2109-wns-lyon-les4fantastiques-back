import { IsEmail, Length, Matches } from "class-validator";
import { Field, ID, InputType, ObjectType, registerEnumType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ERole } from "../types/ERolesEnum";
import { UserProject } from "./UserProject";
import { UserTicket } from "./UserTicket";

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
  @Column({
    length: 55,
  })
  firstname!: string;

  @Field()
  @Column({
    length: 55,
  })
  lastname!: string;

  @Field()
  @Column({
    length: 100,
    unique: true,
  })
  email!: string;

  @Field()
  @Column({
    length: 100,
  })
  password!: string;

  @Field(() => ERole)
  @Column()
  role: ERole = ERole.DEV;

  @Field(() => [UserProject])
  @OneToMany(() => UserProject, (userProject) => userProject.user, { lazy: true })
  userProject!: Promise<UserProject[]>;

  @Field(() => [UserTicket])
  @OneToMany(() => UserTicket, (userTicket) => userTicket.user, { lazy: true })
  userTicket!: Promise<UserTicket[]>;
}

@InputType()
export class UserInputSignUp {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @Matches(/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/, {
    message: "Votre mot de passe doit contenir au moins 8 caractères, une miniscule, une majuscule, un chiffre aisni qu'un caractère spécial",
  })
  password!: string;

  @Field()
  @Column()
  @Length(2, 50)
  @Matches(/^([^0-9]*)$/, {
    message: "Votre nom ne peut pas contenir de chiffres",
  })
  firstname!: string;

  @Field()
  @Column()
  @Length(2, 50)
  @Matches(/^([^0-9]*)$/, {
    message: "Votre nom ne peut pas contenir de chiffres",
  })
  lastname!: string;
}
@InputType()
export class UserInputSignIn {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  password!: string;
}
