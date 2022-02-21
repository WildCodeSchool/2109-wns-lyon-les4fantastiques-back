import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import isAuthorized from "../helpers/auth/isAuthorized";
import { User } from "../models/User";
import { UpdateUserProjectInput, UserProject } from "../models/UserProject";
@Resolver(UserProject)
export class UserProjectsResolver {
  private userProjectRepo = getRepository(UserProject);
  private userRepo = getRepository(User);

  @Authorized()
  @Mutation(() => UserProject)
  async updateUserProject(
    @Arg("userProjectId") userProjectId: number,
    @Arg("data", () => UpdateUserProjectInput) updateUserProject: UpdateUserProjectInput,
    @Ctx() context: { user: User }
  ): Promise<UserProject> {
    const currentUser = await this.userRepo.findOne(context.user.id);
    const userProjectToUpdate = await this.userProjectRepo.findOne(userProjectId);

    if (isAuthorized(currentUser.role, userProjectToUpdate.role)) {
      Object.assign(userProjectToUpdate, updateUserProject);
      await userProjectToUpdate.save();
      return userProjectToUpdate;
    }

    return null;
  }
}
