import type { MetaFunction, SerializeFrom } from "@remix-run/node";

import { graphql } from "#app/gql/index";
import { useLoaderData } from "#support/remix";
import { useReadQuery, createQueryPreloader } from "#support/apollo";

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
  const apolloClient = getSingletonApolloClient()
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
            <li key={post.id}>{post.title}</li>
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
