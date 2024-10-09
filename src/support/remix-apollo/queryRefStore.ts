import type { DocumentNode, Kind } from "graphql";
import {
  createQueryPreloader,
  type ApolloClient,
  type PreloadedQueryRef,
} from "@apollo/client/index.js";
import type {
  TypedDocumentNode,
  ResultOf,
  VariablesOf,
} from "@graphql-typed-document-node/core";

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

function getOperationName(node: DocumentNode) {
  const operationDefs = node.definitions.filter(
    (def) => def.kind === ("OperationDefinition" as Kind.OPERATION_DEFINITION)
  );
  if (operationDefs.length > 1) {
    console.warn("GraphQL query must have exact one operation.");
  } else if (operationDefs.length === 0) {
    throw new Error("Query has no GraphQL operation");
  }
  const operation = operationDefs[0];
  if (!operation.name?.value) {
    throw new Error("Give unique query operation name.");
  }
  return operation.name.value;
}

export type StructuredQueryKey<
  T extends TypedDocumentNode<any, any>,
  V extends VariablesOf<T> = VariablesOf<T>
> = V extends { [K in string]: never }
  ? {
      readonly query: T;
      readonly variables?: V;
    }
  : {
      readonly query: T;
      readonly variables: V;
    };

export function createKey({
  query,
  variables = {},
}: StructuredQueryKey<TypedDocumentNode<unknown, unknown>>) {
  return `${getOperationName(query)}:${JSON.stringify(variables)}`;
}

export function getQueryPreloader(client: ApolloClient<unknown>) {
  const preloader = createQueryPreloader(client);
  function getPreloadedQueryRef<
    T extends TypedDocumentNode<any, any>,
    V extends VariablesOf<T>
  >({
    query,
    variables,
  }: StructuredQueryKey<T, V>): PreloadedQueryRef<ResultOf<T>, V> {
    const queryKey = createKey({ query, variables });
    const preloadedQueryRef = getQueryRef(queryKey);
    reset();
    if (preloadedQueryRef) {
      return preloadedQueryRef;
    }
    const queryRef = preloader(query, { variables });
    return queryRef;
  }
  return getPreloadedQueryRef;
}
