import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
  },

  {
    files: ["**/*.js"],
    languageOptions: { globals: globals.browser, sourceType: "module" },
  },

  {
    files: ["build.js"],
    languageOptions: {
      globals: { ...globals.node, ...globals.commonjs },
      sourceType: "commonjs",
    },
  },

  {
    files: ["tailwind.config.js"],
    languageOptions: {
      globals: globals.node,
      sourceType: "commonjs",
    },
  },
]);
