import { useCallback, useMemo } from "react";
import { Link as OriginalLink, type LinkProps } from "react-router";
import { useApolloClient, createQueryPreloader } from "@apollo/client/index.js";
import type {
  TypedDocumentNode,
  VariablesOf,
} from "@graphql-typed-document-node/core";

import {
  createKey,
  getQueryRef,
  setQueryRef,
  type StructuredQueryKey,
} from "./queryRefStore";

export { useReadQuery } from "./hooks/useReadQuery";

export type Props<
  T extends TypedDocumentNode<any, any>,
  V extends VariablesOf<T> = VariablesOf<T>
> = Omit<LinkProps, "prefetch"> &
  (
    | StructuredQueryKey<T, V>
    | {
        readonly query: never;
        readonly variables: never;
      }
  );

export function Link<
  T extends TypedDocumentNode<any, any>,
  V extends VariablesOf<T> = VariablesOf<T>
>({ query, to: toHref, variables, ...rest }: Props<T, V>) {
  const client = useApolloClient();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const queryKey = useMemo(() => createKey({ query, variables }), [toHref]);

  const handleMouseEnter = useCallback(() => {
    if (!query) return;
    if (getQueryRef(queryKey)) return;
    const queryRef = createQueryPreloader(client)(query, {
      variables,
    });
    setQueryRef(queryKey, queryRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  return (
    <OriginalLink
      {...rest}
      to={toHref}
      prefetch="intent"
      onMouseEnter={handleMouseEnter}
    />
  );
}
