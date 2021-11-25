import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { Comment, CommentInputCreation } from '../models/Comment'


@Resolver(Comment)
export class CommentsResolver {
    private commentRepo = getRepository(Comment);

    // retourne tous les commentaires
    @Query(() => [Comment])
    async getComments(): Promise<Comment[]> {
        return await this.commentRepo.find();
    }

    //crée un commentaire
    @Mutation(() => Comment)
    async createComment(@Arg('data', () => CommentInputCreation) comment: CommentInputCreation): Promise<Comment> {
        const newComment = this.commentRepo.create(comment);
        await newComment.save();
        return newComment;
    }

// supprime un commentaire
    @Mutation(() => Comment, { nullable: true })
    async deleteComment(@Arg('id', () => ID) id: number): Promise<Comment | null> {
        const comment = await this.commentRepo.findOne(id);
        if (comment) {
            await comment.remove();
        }
        return comment;
    }
}