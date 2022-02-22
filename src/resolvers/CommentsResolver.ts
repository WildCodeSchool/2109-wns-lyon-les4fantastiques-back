import { Arg, Authorized, Ctx, ID, Mutation, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { Comment, CommentInput, UpdateCommentInput } from "../models/Comment";
import { Ticket } from "../models/Ticket";
import { User } from "../models/User";
import { UserTicket } from "../models/UserTicket";

@Resolver(Comment)
export class CommentsResolver {
  private commentRepo = getRepository(Comment);
  private userTicketRepo = getRepository(UserTicket);
  private ticketRepo = getRepository(Ticket);
  private userRepo = getRepository(User);

  // QUERIES

  // MUTATIONS
  @Authorized()
  @Mutation(() => Comment)
  async createComment(@Arg("data", () => CommentInput) commentInput: CommentInput, @Ctx() context: { user: User }): Promise<Comment> {
    const currentUser = await this.userRepo.findOne(context.user.id);
    const currentTicket = await this.ticketRepo.findOne(commentInput.ticketId);
    const userTicket = await this.userTicketRepo.findOne({ ticket: currentTicket, user: currentUser });

    if (userTicket) {
      const newComment = this.commentRepo.create({
        ticket: currentTicket,
        author: currentUser,
        content: commentInput.content,
      });
      newComment.save();
      return newComment;
    }

    return null;
  }

  @Authorized()
  @Mutation(() => Comment)
  async updateComment(
    @Arg("data", () => UpdateCommentInput) updateCommentInput: UpdateCommentInput,
    @Ctx() context: { user: User }
  ): Promise<Comment> {
    const currentUser = await this.userRepo.findOne(context.user.id);
    const commentToUpdate = await this.commentRepo.findOne(updateCommentInput.commentId);

    if (commentToUpdate.author === currentUser) {
      commentToUpdate.content = updateCommentInput.content;
      commentToUpdate.save();
      return commentToUpdate;
    }

    return null;
  }

  @Authorized()
  @Mutation(() => Comment)
  async deletComment(@Arg("commentId", () => ID) commentId: number, @Ctx() context: { user: User }): Promise<Comment> {
    const currentUser = await this.userRepo.findOne(context.user.id);
    const commentToRemove = await this.commentRepo.findOne(commentId);
    if (commentToRemove.author === currentUser) {
      await commentToRemove.remove();
      return commentToRemove;
    }

    return null;
  }
}
