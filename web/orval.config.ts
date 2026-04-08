import { defineConfig } from "orval";
import "dotenv/config";

export default defineConfig({
  techbookLog: {
    output: {
      mode: "single",
      target: "./src/external/api.ts",
      client: "react-query",
      baseUrl: process.env.NEXT_PUBLIC_API_URL,
      override: {
        mutator: {
          path: './src/external/custom-fetch.ts',
          name: 'customFetch',
        },
      },
    },
    input: {
      target: `${process.env.NEXT_PUBLIC_API_URL}/doc`,
    },
  },
});
