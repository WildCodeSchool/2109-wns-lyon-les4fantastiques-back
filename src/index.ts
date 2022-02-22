import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { UsersResolver } from "./resolvers/UsersResolver";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { customAuthChecker } from "./helpers/auth/customAuthChecker";
import { ProjectsResolver } from "./resolvers/ProjectsResolver";
import { UserProjectsResolver } from "./resolvers/UserProjectResolver";
import { TicketsResolver } from "./resolvers/TicketsResolver";
import { CommentsResolver } from "./resolvers/CommentsResolver";

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  // database connection, the config is loaded from ormconfig.json
  await createConnection();

  // ... Building schema here
  const schema = await buildSchema({
    resolvers: [UsersResolver, ProjectsResolver, UserProjectsResolver, TicketsResolver, CommentsResolver],
    authChecker: customAuthChecker,
  });

  // Create the GraphQL server
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      return {
        token: req.headers.authorization,
        user: null,
      };
    },
  });

  // Start the server
  const { url } = await server.listen(PORT);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
