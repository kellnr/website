import { fileURLToPath } from "node:url";
import { mergeConfig } from "vite";
import { configDefaults, defineConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "e2e/*", ".direnv/**"],
      root: fileURLToPath(new URL("./", import.meta.url)),
    },
  })
);
