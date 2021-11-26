import { Arg, Authorized, ID, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { Ticket, TicketInputCreation } from '../models/Ticket'


@Resolver(Ticket)
export class TicketsResolver {
    private ticketRepo = getRepository(Ticket);

    // retourne tous les tickets
    @Authorized("ADMIN")
    @Query(() => [Ticket])
    async getTickets(): Promise<Ticket[]> {
        return await this.ticketRepo.find();
    }

    // TODO retourne un fichier by id
    @Authorized("DEV")
    @Query(() => [Ticket])
    async getTicket(@Arg('id', () => ID) id: number) : Promise<Ticket> {
        return await this.ticketRepo.findOne(id);
    }

    // crée un ticket
    @Authorized("DEV")
    @Mutation(() => Ticket)
    async createTicket(@Arg('data', () => TicketInputCreation) ticket: TicketInputCreation): Promise<Ticket> {
        const newTicket = this.ticketRepo.create(ticket);
        await newTicket.save();
        return newTicket;
    }

    // supprime un ticket
    @Authorized("PO")
    @Mutation(() => Ticket, { nullable: true })
    async deleteTicket(@Arg('id', () => ID) id: number): Promise<Ticket | null> {
        const ticket = await this.ticketRepo.findOne(id);
        if (ticket) {
            await ticket.remove();
        }
        return ticket;
    }
}