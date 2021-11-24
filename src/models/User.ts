import { Field, ID, InputType, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

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

    @Field()
    @Column()
    role!: string;

}

@InputType()
export class UserInputSignIn {
    @Field()
    email!: string;

    @Field()
    password!: string;
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
