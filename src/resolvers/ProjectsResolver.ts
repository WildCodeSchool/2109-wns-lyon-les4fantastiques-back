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
import { ERoleUserProject } from "../types/ERolesEnum";

@Resolver(Project)
export class ProjectsResolver {
  private projectRepo = getRepository(Project);
  private userRepo = getRepository(User);
  private userProjectRepo = getRepository(UserProject);

  // QUERIES
  // retourne tous les projets
  @Authorized(["PO", "ADMIN"])
  @Query(() => [Project])
  async getProjects(): Promise<Project[]> {
    return await this.projectRepo.find({
      relations: ["userProject", "tickets"],
    });
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
    newUserProject.save();
    newProject.save();
    return newProject;
  }

  @Authorized()
  @Mutation(() => Project)
  async addUserToProject(
    @Arg("data", () => AddUserToProjectInput)
    addUserToProjectInput: AddUserToProjectInput,
    @Ctx() context: { user: User },
  ): Promise<Project> {
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
      const newUserProject = this.userProjectRepo.create({
        user: context.user,
        project: projectToUpdate,
        role: addUserToProjectInput.role,
      });

      newUserProject.save();
      projectToUpdate.save();

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
