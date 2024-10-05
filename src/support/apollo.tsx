import {
  ApolloClient,
  InMemoryCache,
  useReadQuery as useOriginalReadQuery,
  type UseReadQueryResult,
  type InMemoryCacheConfig,
  type QueryRef,
} from "@apollo/client/index.js";

const globalKey = "__serialized_apollo_cache__";

export class HydratedMemoryCache extends InMemoryCache {
  constructor(config?: InMemoryCacheConfig) {
    const hydratedData = (window as any)[globalKey] ?? {};
    super(config);
    this.restore(hydratedData);
  }
}

export function SerializedApolloCache({
  client,
}: {
  readonly client: ApolloClient<unknown>;
}) {
  const serialized = JSON.stringify(client.extract());
  return (
    <script
      suppressHydrationWarning
      type="module"
      id="SERIALIZED_APOLLO_CACHE"
      dangerouslySetInnerHTML={{
        __html: `if (!window.__hydrated_data__) window.${globalKey} = ${serialized};`,
      }}
    />
  );
}

export function useReadQuery<TData>(
  queryRef: QueryRef<TData>
): UseReadQueryResult<TData> {
  return (
    // eslint-disable-next-line react-hooks/rules-of-hooks
    ("toPromise" in queryRef ? useOriginalReadQuery(queryRef) : queryRef) as any
  );
}
