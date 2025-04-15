import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://your-shop.myshopify.com/admin/api/2024-01/graphql.json",
  documents: ["**/*.graphql", "**/*.tsx", "**/*.ts"],
  generates: {
    "./types/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
      },
    },
  },
};

export default config;
