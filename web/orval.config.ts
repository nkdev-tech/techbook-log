import { defineConfig } from "orval";
import "dotenv/config";

export default defineConfig({
  techbookLog: {
    output: {
      mode: "single",
      target: "./src/external/api.ts",
      client: "react-query",
    },
    input: {
      target: `${process.env.API_URL}/doc`,
    },
  },
});
