import path from "path";

import { defineConfig } from "vite";
import { redwood } from "rwsdk/vite";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [redwood(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
