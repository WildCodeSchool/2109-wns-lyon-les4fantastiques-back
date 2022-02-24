import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { UsersResolver } from "./resolvers/UsersResolver";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { customAuthChecker } from "./helpers/auth/customAuthChecker";
import { ProjectsResolver } from "./resolvers/ProjectsResolver";
import { UserProjectsResolver } from "./resolvers/UserProjectResolver";
import { TicketsResolver } from "./resolvers/Tickets/TicketsResolver";
import { CommentsResolver } from "./resolvers/CommentsResolver";
import { graphqlUploadExpress } from "graphql-upload";
import * as express from "express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import * as http from "http";
import * as path from "path";

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  // database connection, the config is loaded from ormconfig.json
  await createConnection();

  const app = express();
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  app.use(express.static(path.join(__dirname, "./uploads")));

  const httpServer = http.createServer(app);

  // ... Building schema here
  const schema = await buildSchema({
    resolvers: [
      UsersResolver,
      ProjectsResolver,
      UserProjectsResolver,
      TicketsResolver,
      CommentsResolver,
    ],
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
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({
    app,
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(
      `Server is running, GraphQL Playground available at ${server.graphqlPath}`,
    );
  });
}

bootstrap();
