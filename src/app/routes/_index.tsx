import type { MetaFunction, SerializeFrom } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { graphql } from "#app/gql";
import { useLoaderData } from "#support/remix";
import { useReadQuery, createQueryPreloader } from "@apollo/client/index.js";

import { getSingletonApolloClient } from "#app/lib/apolloClient";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const query = graphql(`
  query IndexQuery {
    posts {
      id
      title
    }
  }
`);

export async function clientLoader() {
  const apolloClient = getSingletonApolloClient();
  return createQueryPreloader(apolloClient)(query);
}

export default function Posts() {
  const queryRef = useLoaderData<typeof clientLoader>();
  const {
    data: { posts },
  } = useReadQuery(queryRef);

  return (
    <div>
      <section>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </section>
      <nav>
        <ul>
          <li>
            <a href="/api/graphql">GraphQL Playground</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
