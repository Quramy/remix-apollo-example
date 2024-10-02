import { AsyncLocalStorage } from "node:async_hooks";
import { ApolloClient, InMemoryCache } from "@apollo/client/index.js";
import { SchemaLink } from "@apollo/client/link/schema/index.js";

import { createBaseContext } from "../../server/graphql/yoga.js";
import { schema } from "../../server/graphql/schema.js";

const x = new AsyncLocalStorage<ApolloClient<unknown>>();

function createClient() {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    ssrMode: true,
    link: new SchemaLink({
      schema,
      context: createBaseContext(),
    }),
  });
  return client;
}

function getClient() {
  const stored = x.getStore();
  if (stored) return stored;
  return createClient();
}

export function start(cb: (...args: any[]) => unknown) {
  console.log("ALS start");
  return x.run(createClient(), cb);
}

(globalThis as any).__getClient__ = getClient;

export const ApolloClientStorage = {
  start,
  disable: () => x.disable(),
} as const;
