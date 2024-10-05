import { useCallback } from "react";
import { Link as OriginalLink, type LinkProps } from "@remix-run/react";
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
} from "#app/lib/queryRefStore";

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
  const queryKey = createKey({ query, variables });

  const handleMouseEnter = useCallback(() => {
    if (!query) return;
    if (getQueryRef(queryKey)) return;
    const queryRef = createQueryPreloader(client)(query, {
      variables,
    });
    setQueryRef(queryKey, queryRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey, query]);

  return (
    <OriginalLink
      {...rest}
      to={toHref}
      prefetch="intent"
      onMouseEnter={handleMouseEnter}
    />
  );
}
