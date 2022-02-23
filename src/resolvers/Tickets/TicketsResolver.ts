import { ForbiddenError } from "apollo-server";
import { createWriteStream } from "graceful-fs";
import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { getRepository } from "typeorm";
import { Project } from "../../models/Project";
import {
  Ticket,
  TicketFiltersInput,
  TicketInputCreation,
  UpdateTicketInput,
} from "../../models/Ticket";
import { User } from "../../models/User";
import { UserProject } from "../../models/UserProject";
import { UserTicket } from "../../models/UserTicket";
import { ERoleUserTicket } from "../../types/Enums/ERolesTicket";
import { Upload } from "../../types/Upload";
import { GraphQLUpload } from "graphql-upload";
import { Picture } from "../../models/Picture";
import { v4 as uuidv4 } from "uuid";
import { addFilters } from "./Filters/TicketsFilters";

@Resolver(Ticket)
export class TicketsResolver {
  private ticketRepo = getRepository(Ticket);
  private userRepo = getRepository(User);
  private projectRepo = getRepository(Project);
  private userProjectRepo = getRepository(UserProject);
  private userTicketRepo = getRepository(UserTicket);
  private pictureRepo = getRepository(Picture);

  // QUERIES
  @Authorized()
  @Query(() => [Ticket])
  async getTickets(
    @Arg("data", () => TicketFiltersInput)
    ticketFiltersInput: TicketFiltersInput,
    @Ctx() context: { user: User },
  ): Promise<Ticket[]> {
    const userProject = this.userProjectRepo.findOne({
      where: {
        user: context.user,
        project: ticketFiltersInput.projectId,
      },
    });

    if (userProject) {
      const qb = this.userRepo
        .createQueryBuilder()
        .select("ticket")
        .from(Ticket, "ticket");

      addFilters(ticketFiltersInput, qb);
      const tickets = qb.getMany();
      return tickets;
    }
  }

  @Authorized()
  @Query(() => Ticket)
  async getTicket(
    @Arg("id", () => ID) ticketId: number,
    @Ctx() context: { user: User },
  ): Promise<Ticket> {
    const ticket = await this.ticketRepo.findOne(ticketId, {
      relations: ["project", "userTicket", "comments"],
    });
    const userProject = await this.userProjectRepo.findOne({
      where: {
        project: ticket.project,
        user: context.user,
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
    @Ctx() context: { user: User },
  ): Promise<Ticket | ForbiddenError> {
    const project = await this.projectRepo.findOne(ticket.projectId);
    const currentUserProject = await this.userProjectRepo.findOne({
      where: {
        user: context.user,
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
        user: context.user,
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
    @Ctx() context: { user: User },
  ): Promise<Ticket | void> {
    const ticketToUpdate = await this.ticketRepo.findOne(
      UpdateTicketInput.ticketId,
    );
    // const project = await this.projectRepo.findOne(ticket.project);
    const userTicketToUpdate = await this.userTicketRepo.find({
      where: {
        ticket: ticketToUpdate,
        user: context.user,
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
        const userToAssign = await this.userRepo.findOne(
          UpdateTicketInput.userAssignedId,
        );
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

  @Authorized()
  @Mutation(() => String)
  async addPictureToTicket(
    @Arg("ticketId", () => ID)
    ticketId: number,
    @Arg("picture", () => GraphQLUpload)
    { createReadStream, filename }: Upload,
    @Ctx() context: { user: User },
  ): Promise<string> {
    const ticketToUpdate = await this.ticketRepo.findOne(ticketId);
    const userTicket = await this.userTicketRepo.findOne({
      where: {
        ticket: ticketToUpdate,
        user: context.user,
      },
    });

    if (userTicket) {
      const newFilename = uuidv4();
      await createReadStream().pipe(
        createWriteStream(__dirname + `/../uploads/${newFilename}-${filename}`),
      );

      const newPicture = this.pictureRepo.create({
        ticket: ticketToUpdate,
        contentUrl: `${newFilename}-${filename}`,
      });
      newPicture.save();
      return newPicture.contentUrl;
    }

    return null;
  }
}
