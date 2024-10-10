import { Suspense } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { QueryRef } from "@apollo/client/index.js";

import { useLoaderData } from "#support/remix";
import { getQueryPreloader } from "#support/remix-apollo";
import { useReadQuery } from "#support/remix-apollo/react";

import { graphql, type DocumentType } from "#app/gql";
import { getSingletonApolloClient } from "#app/lib/apolloClient";

import { Comment } from "./Comment";

export const query = graphql(`
  query PostDetail_Query($postId: ID!) {
    post(id: $postId) {
      title
      body
      comments {
        id
        ...Comment_Comment
      }
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
  const apolloClient = getSingletonApolloClient();

  return getQueryPreloader(apolloClient)({
    query,
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
      <h1>{data.post.title}</h1>
      <p>{data.post.body}</p>
      <ul>
        {data.post.comments.map((comment) => (
          <li key={comment.id}>
            <Comment comment={comment} />
          </li>
        ))}
      </ul>
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
