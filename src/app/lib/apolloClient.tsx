import { ApolloClient, InMemoryCache } from "@apollo/client/index.js";

let _client: ApolloClient<unknown> | undefined;

export function getSingletonApolloClient() {
  if (typeof document !== "undefined") {
    if (!_client) {
      const cache = new InMemoryCache();
      const hydratedData = (window as any).__hydrated_data__ ?? {};
      cache.restore(hydratedData);
      _client = new ApolloClient({
        cache,
        uri: "/api/graphql",
      });
    }
    return _client;
  } else {
    const client = (globalThis as any).__getClient__() as ApolloClient<unknown>;
    return client;
  }
}

export function HydratedApolloCache({
  client,
}: {
  readonly client: ApolloClient<unknown>;
}) {
  const serialized = JSON.stringify(client.extract());
  return (
    <script
      suppressHydrationWarning
      type="module"
      id="HYDRATED_APOLLO_CACHE"
      dangerouslySetInnerHTML={{
        __html: `if (!window.__hydrated_data__) window.__hydrated_data__ = ${serialized};`,
      }}
    />
  );
}
