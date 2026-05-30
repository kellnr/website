import pluginVue from "eslint-plugin-vue";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";

export default defineConfigWithVueTs(
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
  },

  {
    name: "app/files-to-ignore",
    ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**", "**/node_modules/**"],
  },

  pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,

  {
    // Blog posts and views are single-instance page components, so the
    // multi-word component name rule (meant to avoid clashes with native
    // HTML elements) does not apply.
    name: "app/views-single-word-names",
    files: ["src/views/**/*.vue"],
    rules: {
      "vue/multi-word-component-names": "off",
    },
  }
);
