import { SelectQueryBuilder } from "typeorm";
import { Ticket, TicketFiltersInput } from "../../../models/Ticket";
import { ERoleUserTicket } from "../../../types/Enums/ERolesTicket";

export const addFilters = (
  input: TicketFiltersInput,
  queryBuilder: SelectQueryBuilder<Ticket>,
): SelectQueryBuilder<Ticket> => {
  for (const filter in input) {
    if (filter === "projectId") {
      queryBuilder
        .innerJoinAndSelect(
          "ticket.project",
          "project",
          "project.isActive = :isActive",
          {
            isActive: true,
          },
        )
        .andWhere("project.id = :projectId", {
          projectId: input.projectId,
        });
    }

    if (filter === "userAssignedId") {
      queryBuilder
        .innerJoinAndSelect("ticket.userTicket", "userTicket")
        .andWhere("userTicket.user = :userId", {
          userId: input.userAssignedId,
        })
        .andWhere("userTicket.role = :role", {
          role: ERoleUserTicket.ASSIGNEE,
        });
    }
  }
  return queryBuilder;
};
