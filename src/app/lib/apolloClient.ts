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
    // FIXME
    return new ApolloClient({
      cache: new InMemoryCache(),
      uri: "",
    });
  }
}
