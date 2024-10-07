import { ApolloClient } from "@apollo/client/index.js";

import { HydratedMemoryCache } from "#support/apollo";

import type { GetApolloClientMeta } from "./apolloClient";

let _client: ApolloClient<unknown> | undefined;

function getApolloClient(): ApolloClient<unknown> {
  if (!_client) {
    _client = new ApolloClient({
      cache: new HydratedMemoryCache(),
      uri: "/api/graphql",
    });
  }
  return _client;
}

export const serviceMeta = {
  key: "getApolloClient",
  value: getApolloClient,
} satisfies GetApolloClientMeta;
