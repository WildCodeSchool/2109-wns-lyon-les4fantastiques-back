import { ForbiddenError } from "apollo-server";
import { Arg, Authorized, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { Project } from "../models/Project";
import { Ticket, TicketInputCreation, UpdateTicketInput } from "../models/Ticket";
import { User } from "../models/User";
import { UserProject } from "../models/UserProject";
import { UserTicket } from "../models/UserTicket";
import { ERoleUserTicket } from "../types/ERolesEnum";

@Resolver(Ticket)
export class TicketsResolver {
  private ticketRepo = getRepository(Ticket);
  private userRepo = getRepository(User);
  private projectRepo = getRepository(Project);
  private userProjectRepo = getRepository(UserProject);
  private userTicketRepo = getRepository(UserTicket);

  // QUERIES

  @Authorized()
  @Query(() => Ticket)
  async getTicket(@Arg("id", () => ID) ticketId: number, @Ctx() context: { user: User }): Promise<Ticket> {
    const currentUser = await this.userRepo.findOne(context.user.id);
    const ticket = await this.ticketRepo.findOne(ticketId, { relations: ["project", "userTicket", "comments"] });
    const userProject = await this.userProjectRepo.findOne({
      where: {
        project: ticket.project,
        user: currentUser,
      },
    });

    if (userProject) {
      return ticket;
    }

    return null;
  }

  // Mutation

  // CreateTicket
  @Authorized()
  @Mutation(() => Ticket)
  async createTicket(
    @Arg("data", () => TicketInputCreation) ticket: TicketInputCreation,
    @Ctx() context: { user: User }
  ): Promise<Ticket | ForbiddenError> {
    const currentUser = await this.userRepo.findOne(context.user.id);
    const project = await this.projectRepo.findOne(ticket.projectId);
    const currentUserProject = await this.userProjectRepo.findOne({
      where: {
        user: currentUser,
        project: project,
      },
    });

    if (currentUserProject && project) {
      const newTicket = this.ticketRepo.create({
        name: ticket.name,
        description: ticket.description,
        timeEstimation: ticket.timeEstimation,
        project: project,
      });
      newTicket.creationDate = new Date();
      await newTicket.save();
      const newUserTicket = this.userTicketRepo.create({
        user: currentUser,
        ticket: newTicket,
      });
      newUserTicket.save();
      return newTicket;
    }

    throw new ForbiddenError("You cannot create a ticket for this project");
  }

  // update userAssigned or timeSpent on a ticket
  @Authorized()
  @Mutation(() => Ticket)
  async updateTicket(
    @Arg("data", () => UpdateTicketInput) UpdateTicketInput: UpdateTicketInput,
    @Ctx() context: { user: User }
  ): Promise<Ticket | void> {
    const currentUser = await this.userRepo.findOne(context.user.id);
    const ticketToUpdate = await this.ticketRepo.findOne(UpdateTicketInput.ticketId);
    // const project = await this.projectRepo.findOne(ticket.project);
    const userTicketToUpdate = await this.userTicketRepo.find({
      where: {
        ticket: ticketToUpdate,
        user: currentUser,
      },
    });

    if (userTicketToUpdate) {
      if (UpdateTicketInput.timeSpent) {
        ticketToUpdate.timeSpent = UpdateTicketInput.timeSpent;
      }
      if (UpdateTicketInput.timeEstimation) {
        ticketToUpdate.timeEstimation = UpdateTicketInput.timeEstimation;
      }
      if (UpdateTicketInput.userAssignedId) {
        const userToAssign = await this.userRepo.findOne(UpdateTicketInput.userAssignedId);
        const userTicketToUpdate = await this.userTicketRepo.findOne({
          where: {
            ticket: ticketToUpdate,
            user: userToAssign,
            role: ERoleUserTicket.ASSIGNEE,
          },
        });

        if (!userTicketToUpdate) {
          const userTicketToDelete = await this.userTicketRepo.findOne({
            where: { ticket: ticketToUpdate, role: ERoleUserTicket.ASSIGNEE },
          });
          userTicketToDelete && this.userTicketRepo.delete(userTicketToDelete);

          const newUserTicket = this.userTicketRepo.create({
            ticket: ticketToUpdate,
            user: userToAssign,
            role: ERoleUserTicket.ASSIGNEE,
          });
          newUserTicket.save();
        }
      }

      ticketToUpdate.save();
      return ticketToUpdate;
    }
  }
}
