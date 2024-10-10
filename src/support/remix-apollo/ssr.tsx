import {
  ApolloClient,
  InMemoryCache,
  type InMemoryCacheConfig,
} from "@apollo/client/index.js";

const globalSerializedDataKey = "__serialized_apollo_cache__";

export class HydratedMemoryCache extends InMemoryCache {
  constructor(config?: InMemoryCacheConfig) {
    const hydratedData = (window as any)[globalSerializedDataKey] ?? {};
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
        __html: `if (!window.${globalSerializedDataKey}) window.${globalSerializedDataKey} = ${serialized};`,
      }}
    />
  );
}
