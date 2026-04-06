import { defineConfig } from "orval";
import "dotenv/config";

export default defineConfig({
  techbookLog: {
    output: {
      mode: "single",
      target: "./src/external/api.ts",
      client: "react-query",
      baseUrl: process.env.API_URL,
    },
    input: {
      target: `${process.env.API_URL}/doc`,
    },
  },
});
