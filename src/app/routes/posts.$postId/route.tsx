import { Suspense } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { createQueryPreloader, QueryRef } from "@apollo/client/index.js";

import { useReadQuery } from "#support/apollo";
import { useLoaderData } from "#support/remix";

import { graphql, type DocumentType } from "#app/gql";
import { getSingletonApolloClient } from "#app/lib/apolloClient";

const query = graphql(`
  query PostDetail_Query($postId: ID!) {
    post(id: $postId) {
      title
      body
    }
  }
`);

export async function loader({ params, context }: LoaderFunctionArgs) {
  const apolloClient = getSingletonApolloClient();
  const { postId } = params as { readonly postId: string };

  return await apolloClient.query({
    query,
    variables: {
      postId,
    },
  });
}

export async function clientLoader({ params }: LoaderFunctionArgs) {
  const apolloClient = getSingletonApolloClient();
  const { postId } = params as { readonly postId: string };
  return createQueryPreloader(apolloClient)(query, { variables: { postId } });
}

function Inner({
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

export default function PostDetail() {
  const queryRef = useLoaderData<typeof clientLoader>();
  return (
    <Suspense fallback="loading...">
      <Inner queryRef={queryRef} />
    </Suspense>
  );
}
