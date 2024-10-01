import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div>
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
