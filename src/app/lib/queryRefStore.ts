import {
  createQueryPreloader,
  type PreloadedQueryRef,
} from "@apollo/client/index.js";
import type {
  TypedDocumentNode,
  ResultOf,
  VariablesOf,
} from "@graphql-typed-document-node/core";

import { getSingletonApolloClient } from "#app/lib/apolloClient";

let store = new Map<string, any>();

export function setQueryRef(key: string, queryRef: any) {
  store.set(key, queryRef);
}

export function getQueryRef(key: string) {
  return store.get(key);
}

export function reset() {
  store = new Map<string, any>();
}

export type GetPreloadedQueryRefProps<T extends TypedDocumentNode<any, any>> = {
  readonly queryKey: string;
  readonly query: T;
  readonly variables: VariablesOf<T>;
};

export function getPreloadedQueryRef<T extends TypedDocumentNode<any, any>>({
  queryKey,
  query,
  variables,
}: GetPreloadedQueryRefProps<T>): PreloadedQueryRef<
  ResultOf<T>,
  VariablesOf<T>
> {
  const preloadedQueryRef = getQueryRef(queryKey);
  reset();
  if (preloadedQueryRef) {
    return preloadedQueryRef;
  }
  const client = getSingletonApolloClient();
  const queryRef = createQueryPreloader(client)(query, { variables });
  return queryRef;
}
