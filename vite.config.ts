import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { latestMajor } from "./scripts/changelog-format.mjs";

// Computed here, so the pages that show the Docker image do not bundle the whole changelog.
function kellnrMajor(): number {
  const changelogPath = fileURLToPath(new URL("./src/data/changelog.json", import.meta.url));
  const doc = JSON.parse(readFileSync(changelogPath, "utf8"));
  return latestMajor(doc);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => {
            return tag.startsWith("stripe-buy-button");
          },
          whitespace: "preserve",
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  define: {
    __KELLNR_MAJOR__: JSON.stringify(kellnrMajor()),
  },
  css: {
    devSourcemap: false,
  },
});
