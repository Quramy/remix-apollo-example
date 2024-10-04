import { Suspense } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { QueryRef } from "@apollo/client/index.js";

import { useReadQuery } from "#support/apollo";
import { useLoaderData } from "#support/remix";

import { graphql, type DocumentType } from "#app/gql";
import { getSingletonApolloClient } from "#app/lib/apolloClient";
import { getPreloadedQueryRef } from "#app/lib/queryRefStore";

export const query = graphql(`
  query PostDetail_Query($postId: ID!) {
    post(id: $postId) {
      title
      body
    }
  }
`);

export async function loader({ params }: LoaderFunctionArgs) {
  const { postId } = params as { readonly postId: string };
  const apolloClient = getSingletonApolloClient();

  return await apolloClient.query({
    query,
    variables: {
      postId,
    },
  });
}

export async function clientLoader({ params }: LoaderFunctionArgs) {
  const { postId } = params as { readonly postId: string };

  return getPreloadedQueryRef({
    queryKey: `/posts/${postId}`,
    query: query,
    variables: {
      postId,
    },
  });
}

function PostDetail({
  queryRef,
}: {
  queryRef: QueryRef<DocumentType<typeof query>>;
}) {
  const { data } = useReadQuery(queryRef);
  if (!data.post) return <div>Not found...</div>;
  return (
    <div>
      <h2>{data.post.title}</h2>
      <p>{data.post.body}</p>
    </div>
  );
}

export default function Page() {
  const queryRef = useLoaderData<typeof clientLoader>();
  return (
    <main>
      <Suspense fallback="loading...">
        <PostDetail queryRef={queryRef} />
      </Suspense>
    </main>
  );
}
