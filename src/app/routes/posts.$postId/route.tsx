import { Suspense } from "react";
import type { LoaderFunctionArgs } from "react-router";
import type { QueryRef } from "@apollo/client/index.js";

import { useLoaderData } from "#support/remix";
import { getQueryPreloader } from "#support/remix-apollo";
import { useReadQuery } from "#support/remix-apollo/react";

import { graphql, type DocumentType } from "#app/gql";
import { getSingletonApolloClient } from "#app/lib/apolloClient";
import { notFound } from "#app/lib/notFound";

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

  const result = await apolloClient.query({
    query,
    variables: {
      postId,
    },
  });

  if (!result.data.post) notFound();

  return result;
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
  const {
    data: { post },
  } = useReadQuery(queryRef);

  if (!post) notFound();

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <ul>
        {post.comments.map((comment) => (
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
