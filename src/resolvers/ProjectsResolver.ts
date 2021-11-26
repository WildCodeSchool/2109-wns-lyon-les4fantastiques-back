import { Arg, Authorized, ID, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { Project, ProjectInputCreation } from '../models/Project'
import { User } from "../models/User";


@Resolver(Project)
export class ProjectsResolver {
    private projectRepo = getRepository(Project);
    private userRepo = getRepository(User);

    // retourne tous les projets
    @Authorized(["PO", "ADMIN"])
    @Query(() => [Project])
    async getProjects(): Promise<Project[]> {
        return await this.projectRepo.find();
    }

    // retourner un seul projet
    @Authorized()
    @Query(() => [Project])
    async getProject(@Arg('id', () => ID) id: number): Promise<Project> {
        return await this.projectRepo.findOne(id);
    }

    //crée un projet
    //@Authorized(["PO", "ADMIN"])
    @Mutation(() => Project)
    async createProject(@Arg('data', () => ProjectInputCreation) project: ProjectInputCreation, @Arg('userId', () => ID) userId: number): Promise<Project> {
        const user = await this.userRepo.findOne(userId);
        const newProject = this.projectRepo.create(project);
        newProject.creationDate = new Date();
        newProject.userAuthor = user;
        await newProject.save();
        return newProject;
    }

// supprime un projet
    @Authorized(["PO", "ADMIN"])
    @Mutation(() => Project, { nullable: true })
    async deleteProject(@Arg('id', () => ID) id: number): Promise<Project | null> {
        const project = await this.projectRepo.findOne(id);
        if (project) {
            await project.remove();
        }
        return project;
    }
}