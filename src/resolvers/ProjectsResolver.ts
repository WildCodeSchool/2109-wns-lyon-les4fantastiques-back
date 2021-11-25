import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { Project, ProjectInputCreation } from '../models/Project'


@Resolver(Project)
export class ProjectsResolver {
    private projectRepo = getRepository(Project);

    // retourne tous les projets
    @Query(() => [Project])
    async getProjects(): Promise<Project[]> {
        return await this.projectRepo.find();
    }

    // retourner un seul projet
    @Query(() => [Project])
    async getProject(@Arg('id', () => ID) id: number): Promise<Project> {
        return await this.projectRepo.findOne(id);
    }

    //crée un projet
    @Mutation(() => Project)
    async createProject(@Arg('data', () => ProjectInputCreation) project: ProjectInputCreation): Promise<Project> {
        const newProject = this.projectRepo.create(project);
        await newProject.save();
        return newProject;
    }

// supprime un projet
    @Mutation(() => Project, { nullable: true })
    async deleteProject(@Arg('id', () => ID) id: number): Promise<Project | null> {
        const project = await this.projectRepo.findOne(id);
        if (project) {
            await project.remove();
        }
        return project;
    }
}