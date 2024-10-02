import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "schema.graphql",
  generates: {
    // Server
    "src/server/graphql/__generated__/graphql.ts": {
      plugins: ["typescript", "add", "typescript-resolvers"],
      config: {
        constextType: "BaseContext",
        content: 'import { BaseContext } from "../types.js"',
      },
    },
    // Client
    "src/app/gql/": {
      documents: ["src/app/**/*.tsx"],
      preset: "client",
    },
  },
};

export default config;
