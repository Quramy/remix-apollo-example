import { ApolloClient, InMemoryCache } from "@apollo/client/index.js";

let _client: ApolloClient<unknown> | undefined;

export function getSingletonApolloClient() {
  if (typeof document !== "undefined") {
    if (!_client) {
      _client = new ApolloClient({
        cache: new InMemoryCache(),
        uri: "/api/graphql",
      });
    }
    return _client;
  } else {
    const client = (globalThis as any).__getClient__() as ApolloClient<unknown>;
    return client;
  }
}
