import { ApolloClient, InMemoryCache } from "@apollo/client/index.js";
import { SchemaLink } from "@apollo/client/link/schema/index.js";

import { createBaseContext } from "../../server/graphql/yoga.js";
import { schema } from "../../server/graphql/schema.js";

import { cache } from "./requestContext.js";
import { GetApolloClientMeta } from "./apolloClient";

function createApolloClient(): ApolloClient<unknown> {
  return new ApolloClient({
    cache: new InMemoryCache(),
    ssrMode: true,
    link: new SchemaLink({
      schema,
      context: createBaseContext(),
    }),
  });
}

const getApolloClient = cache(createApolloClient);

export const serviceMeta = {
  key: "getApolloClient",
  value: getApolloClient,
} as const satisfies GetApolloClientMeta;
