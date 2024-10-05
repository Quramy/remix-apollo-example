import { ApolloClient, InMemoryCache } from "@apollo/client/index.js";
import { SchemaLink } from "@apollo/client/link/schema/index.js";

import { createBaseContext } from "../../server/graphql/yoga.js";
import { schema } from "../../server/graphql/schema.js";

import { cache } from "./requestContext.js";

function createApolloClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    ssrMode: true,
    link: new SchemaLink({
      schema,
      context: createBaseContext(),
    }),
  });
}

export const getServerClient = cache(createApolloClient);

(globalThis as any).__getClient__ = getServerClient;
