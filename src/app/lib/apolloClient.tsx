import type { ApolloClient } from "@apollo/client/index.js";

import { lookupService } from "#support/serviceRegistry";

export type GetApolloClientMeta = {
  readonly key: "getApolloClient";
  readonly value: () => ApolloClient<unknown>;
};

export function getSingletonApolloClient(): ApolloClient<unknown> {
  const getApolloClient = lookupService<GetApolloClientMeta>("getApolloClient");
  return getApolloClient();
}
