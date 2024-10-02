import { ApolloClient, InMemoryCache } from "#support/apollo";

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "/api/graphql",
});

export function getSingletonApolloClient() {
  return apolloClient;
}
