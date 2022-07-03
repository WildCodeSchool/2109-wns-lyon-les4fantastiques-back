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
import isAuthorized from "../helpers/auth/isAuthorized";
import { Project, ProjectInput } from "../models/Project";
import { User } from "../models/User";
import { AddUserToProjectInput, UserProject } from "../models/UserProject";
import { ERole } from "../types/Enums/Erole";
import { ERoleUserProject } from "../types/Enums/ERoleUserProject";

@Resolver(Project)
export class ProjectsResolver {
  private projectRepo = getRepository(Project);
  private userProjectRepo = getRepository(UserProject);
  private userRepo = getRepository(User);

  // QUERIES
  // retourne tous les projets
  @Authorized()
  @Query(() => [Project])
  async getProjects(@Ctx() context: { user: User }): Promise<Project[]> {
    const qb = this.projectRepo
      .createQueryBuilder()
      .select("project")
      .from(Project, "project")
      .innerJoinAndSelect("project.userProject", "userProject")
      .where("project.isActive = :isActive", { isActive: true });
    if (context.user.role !== ERole.ADMIN) {
      qb.andWhere("userProject.user = :userId", { userId: context.user.id });
    }
    const projects = qb.getMany();
    return projects;
  }

  // retourner un seul projet
  @Authorized()
  @Query(() => Project)
  async getProject(@Arg("id", () => ID) id: number): Promise<Project> {
    return await this.projectRepo.findOne(id, {
      relations: ["userProject", "tickets"],
    });
  }

  //MUTATIONS

  @Authorized(["PO", "ADMIN"])
  @Mutation(() => Project)
  async createProject(
    @Arg("data", () => ProjectInput) projectInput: ProjectInput,
    @Ctx() context: { user: User },
  ): Promise<Project> {
    const newProject = this.projectRepo.create({ ...projectInput });
    newProject.creationDate = new Date();
    await newProject.save();

    const newUserProject = this.userProjectRepo.create({
      user: context.user,
      project: newProject,
      role: ERoleUserProject.AUTHOR,
    });
    await newUserProject.save();
    await newProject.save();
    return newProject;
  }

  @Authorized()
  @Mutation(() => Project)
  async addUserToProject(
    @Arg("data", () => AddUserToProjectInput)
    addUserToProjectInput: AddUserToProjectInput,
    @Ctx() context: { user: User },
  ): Promise<Project | null> {
    const currentUserProject = await this.userProjectRepo.findOne({
      where: {
        user: context.user,
        project: addUserToProjectInput.projectId,
      },
    });

    if (isAuthorized(context.user.role, currentUserProject.role)) {
      const projectToUpdate = await this.projectRepo.findOne(
        addUserToProjectInput.projectId,
      );
      const userToAdd = await this.userRepo.findOne({
        where: { email: addUserToProjectInput.email },
      });

      if (!userToAdd || !projectToUpdate) {
        throw new Error("Unable to add user");
      }
      const newUserProject = this.userProjectRepo.create({
        user: userToAdd,
        project: projectToUpdate,
        role: addUserToProjectInput.role,
      });

      await newUserProject.save();

      return projectToUpdate;
    }

    return null;
  }

  // supprime un projet
  @Authorized(["PO", "ADMIN"])
  @Mutation(() => Project, { nullable: true })
  async deleteProject(
    @Arg("id", () => ID) id: number,
  ): Promise<Project | null> {
    const project = await this.projectRepo.findOne(id);
    if (project) {
      await project.remove();
    }
    return project;
  }
}
