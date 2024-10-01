import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";

import { setupYoga } from "../../server/graphql/yoga";

const yoga = setupYoga({
  graphqlEndpoint: "/api/graphql",
});

export async function loader({ request }: LoaderFunctionArgs) {
  return await yoga.fetch(request, {});
}

export async function action({ request }: ActionFunctionArgs) {
  switch (request.method) {
    case "POST": {
      return await yoga.fetch(request, {});
    }
    default: {
      return new Response("Not found", { status: 404 });
    }
  }
}
