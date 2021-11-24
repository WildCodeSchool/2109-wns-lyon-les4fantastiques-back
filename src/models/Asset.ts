import { Field, InputType } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity} from "typeorm";
import { Ticket } from "./Ticket";

@Entity()
export class Asset extends BaseEntity {
    
    @Field()
    @PrimaryGeneratedColumn()
    id: number;
    
    @Field()
    @Column({
        length: 255
    })
    url: string;

    @Field()
    @Column({
        length: 100
    })
    filename: string;

    @Field(() => Ticket)
    @ManyToOne(() => Ticket, ticket => ticket.id)
    ticketId: Ticket;
}


@InputType()
export class AssetInputUpload {
    @Field()
    url: string;
    
    @Field()
    ticketId: Ticket;

    @Field()
    filename: string;
}