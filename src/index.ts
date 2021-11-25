import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { UsersResolver } from "./resolvers/UsersResolver";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { customAuthChecker } from "./helpers/auth/customAuthChecker";

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  // database connection, the config is loaded from ormconfig.json
  await createConnection();

  // ... Building schema here
  const schema = await buildSchema({
    resolvers: [UsersResolver],
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
