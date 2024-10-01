import { PrismaClient } from "@prisma/client";
import { createYoga } from "graphql-yoga";

import type { ServerContext } from "./types.js";
import { schema } from "./schema.js";
import { createLoaders } from "./loaders/index.js";

type SetupYogaOptions = {
  readonly graphqlEndpoint?: string;
};

export function setupYoga({ graphqlEndpoint }: SetupYogaOptions) {
  const prisma = new PrismaClient({
    log: ["info", "error", "warn", "query"],
  });

  const yoga = createYoga({
    schema,
    graphqlEndpoint,
    context(initialContext) {
      const loaders = createLoaders({ prisma });
      const context: ServerContext = {
        ...initialContext,
        prisma,
        loaders,
      };
      return context;
    },
    fetchAPI: { Request, Response },
  });

  return yoga;
}
