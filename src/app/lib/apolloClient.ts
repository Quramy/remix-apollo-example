import { ApolloClient, InMemoryCache } from "@apollo/client/index.js";

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "/api/graphql",
});

export function getSingletonApolloClient() {
  return apolloClient;
}
