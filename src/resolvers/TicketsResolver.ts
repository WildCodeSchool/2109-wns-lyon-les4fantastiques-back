import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { Ticket, TicketInputCreation } from '../models/Ticket'


@Resolver(Ticket)
export class TicketsResolver {
    private ticketRepo = getRepository(Ticket);

    // retourne tous les tickets
    @Query(() => [Ticket])
    async getTickets(): Promise<Ticket[]> {
        return await this.ticketRepo.find();
    }

    // TODO retourne un fichier by id
    @Query(() => [Ticket])
    async getTicket(@Arg('id', () => ID) id: number) : Promise<Ticket> {
        return await this.ticketRepo.findOne(id);
    }

    // crée un ticket
    @Mutation(() => Ticket)
    async createTicket(@Arg('data', () => TicketInputCreation) ticket: TicketInputCreation): Promise<Ticket> {
        const newTicket = this.ticketRepo.create(ticket);
        await newTicket.save();
        return newTicket;
    }

    // 
    @Mutation(() => Ticket, { nullable: true })
    async deleteTicket(@Arg('id', () => ID) id: number): Promise<Ticket | null> {
        const ticket = await this.ticketRepo.findOne(id);
        if (ticket) {
            await ticket.remove();
        }
        return ticket;
    }
}