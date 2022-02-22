import { createWriteStream } from "fs";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { GraphQLUpload } from "graphql-upload";
import { Upload } from "../types/Upload";

@Resolver()
export class PicturesResolver {
  @Authorized()
  @Query(() => String)
  async getPicture(): Promise<string> {
    let serverFile = __dirname + "../uploads/brazil.jpg";
    serverFile = `http://localhost:4000${serverFile.split("uploads")[1]}`;
    return serverFile;
  }
}
