import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { WildersResolver } from "./resolvers/Wilders";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  // database connection, the config is loaded from ormconfig.json
  await createConnection();

  // ... Building schema here
  const schema = await buildSchema({
    resolvers: [WildersResolver],
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
