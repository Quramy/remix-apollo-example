import { Suspense } from "react";
import type { MetaFunction } from "@remix-run/node";
import type { QueryRef } from "@apollo/client/index.js";

import { useReadQuery } from "#support/apollo";
import { useLoaderData } from "#support/remix";

import { graphql, type DocumentType } from "#app/gql";
import { getSingletonApolloClient } from "#app/lib/apolloClient";
import { getQueryPreloader } from "#app/lib/queryRefStore";

import { Link } from "#app/components/Link";
import { query as PostDetail_Query } from "#app/routes/posts.$postId/route";

export const meta: MetaFunction = () => {
  return [
    { title: "Apollo Remix App" },
    {
      name: "description",
      content: "An example application Remix with Apollo Client",
    },
  ];
};

export const query = graphql(`
  query Posts_Query {
    posts {
      id
      title
    }
  }
`);

export async function loader() {
  const apolloClient = getSingletonApolloClient();
  return await apolloClient.query({ query });
}

export async function clientLoader() {
  const apolloClient = getSingletonApolloClient();
  return getQueryPreloader(apolloClient)({ query });
}

function Posts({
  queryRef,
}: {
  readonly queryRef: QueryRef<DocumentType<typeof query>>;
}) {
  const {
    data: { posts },
  } = useReadQuery(queryRef);

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link
            to={`/posts/${post.id}`}
            query={PostDetail_Query}
            variables={{ postId: post.id }}
          >
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Page() {
  const queryRef = useLoaderData<typeof clientLoader>();

  return (
    <main>
      <section>
        <Suspense fallback="loading...">
          <Posts queryRef={queryRef} />
        </Suspense>
      </section>
      <nav>
        <a href="/api/graphql">GraphQL Playground</a>
      </nav>
    </main>
  );
}
