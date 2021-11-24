import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { UsersResolver } from "./resolvers/UsersResolver";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  // database connection, the config is loaded from ormconfig.json
  await createConnection();

  // ... Building schema here
  const schema = await buildSchema({
    resolvers: [UsersResolver],
  });

  // Create the GraphQL server
  const server = new ApolloServer({
    schema,
  });

  // Start the server
  const { url } = await server.listen(PORT);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
