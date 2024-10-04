import { useCallback } from "react";
import { Link as OriginalLink, type LinkProps } from "@remix-run/react";
import { useApolloClient, createQueryPreloader } from "@apollo/client/index.js";
import type {
  TypedDocumentNode,
  VariablesOf,
} from "@graphql-typed-document-node/core";

import { getQueryRef, setQueryRef } from "#app/lib/queryRefStore";

export type Props<T extends TypedDocumentNode<any, any>> = Omit<
  LinkProps,
  "prefetch"
> &
  (
    | {
        readonly query: T;
        readonly variables: VariablesOf<T>;
        readonly queryKey?: string;
      }
    | {
        readonly query: never;
        readonly variables: never;
        readonly queryKey?: string;
      }
  );

export function Link<T extends TypedDocumentNode<any, any>>({
  query,
  to: toHref,
  queryKey,
  variables,
  ...rest
}: Props<T>) {
  const client = useApolloClient();
  const queryRefStoreKey = queryKey ?? toHref.toString();

  const handleMouseEnter = useCallback(() => {
    if (!query) return;
    if (getQueryRef(queryRefStoreKey)) return;
    const queryRef = createQueryPreloader(client)(query, {
      variables,
    });
    setQueryRef(queryRefStoreKey, queryRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryRefStoreKey, query]);

  return (
    <OriginalLink
      {...rest}
      to={toHref}
      prefetch="intent"
      onMouseEnter={handleMouseEnter}
    />
  );
}
