import { PrismaClient } from "@prisma/client";
import { createYoga } from "graphql-yoga";

import type { ServerContext, BaseContext } from "./types.js";
import { schema } from "./schema.js";
import { createLoaders } from "./loaders/index.js";

const prisma = new PrismaClient({
  log: ["info", "error", "warn", "query"],
});

type SetupYogaOptions = {
  readonly graphqlEndpoint?: string;
};

export function createBaseContext(): BaseContext {
  const loaders = createLoaders({ prisma });
  return {
    prisma,
    loaders,
  };
}

export function setupYoga({ graphqlEndpoint }: SetupYogaOptions) {
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
  });

  return yoga;
}
