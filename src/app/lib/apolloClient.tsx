import { ApolloClient } from "@apollo/client/index.js";

import { HydratedMemoryCache } from "#support/apollo";

let _client: ApolloClient<unknown> | undefined;

export function getSingletonApolloClient() {
  if (typeof document !== "undefined") {
    if (!_client) {
      _client = new ApolloClient({
        cache: new HydratedMemoryCache(),
        uri: "/api/graphql",
      });
    }
    return _client;
  } else {
    const client = (globalThis as any).__getClient__() as ApolloClient<unknown>;
    return client;
  }
}
