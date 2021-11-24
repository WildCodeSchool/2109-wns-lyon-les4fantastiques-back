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
    @Column({
        length: 55
    })
    firstname!: string;

    @Field()
    @Column({
        length: 55
    })
    lastname!: string;

    @Field()
    @Column({
        length: 100
    })
    email!: string;

    @Field()
    @Column({
        length: 12
    })
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
    firstname!: string;

    @Field()
    lastname!: string;
}
