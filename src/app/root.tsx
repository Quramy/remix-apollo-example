import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
  type LinksFunction,
} from "react-router";
import { ApolloProvider } from "@apollo/client/index.js";
import { SerializedApolloCache } from "#support/remix-apollo";

import { getSingletonApolloClient } from "#app/lib/apolloClient";

import { NotFound } from "./routes/$/route";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <SerializedApolloCache client={getSingletonApolloClient()} />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ApolloProvider client={getSingletonApolloClient()}>
      <Outlet />
    </ApolloProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (
    (isRouteErrorResponse(error) && error.status === 404) ||
    (error instanceof Response && error.status === 404)
  ) {
    return <NotFound />;
  }
  console.error(error);
  return <main>Something went wrong...</main>;
}
