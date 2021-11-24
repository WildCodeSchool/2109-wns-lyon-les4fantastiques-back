import { Field, ID, InputType, ObjectType, registerEnumType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ERole } from "../types";
import { Project } from "./Project";
import { Ticket } from "./Ticket";

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

    @Field(() => Ticket)
    @OneToMany(() => Ticket, ticket => ticket.id)
    ticketAssigned: Ticket[];

    @Field(() => Project)
    @ManyToMany(() => Project, project => project.id)
    projectContribution: Project[];

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
