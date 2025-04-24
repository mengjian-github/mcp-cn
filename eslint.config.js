import cspellPlugin from "@cspell/eslint-plugin";
import { FlatCompat } from "@eslint/eslintrc";
import eslintJsPlugin from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import tsEslint from "typescript-eslint";

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});

const typescriptConfigs = /** @type {import('eslint').Linter.Config[]} */ (
  tsEslint.config({
    plugins: {
      "@typescript-eslint": tsEslint.plugin,
    },
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    extends: [
      tsEslint.configs.strictTypeChecked,
      tsEslint.configs.stylisticTypeChecked,
    ],
  })
);

/**
 * @type {import('eslint').Linter.Config[]}
 */
const eslintConfig = [
  { ignores: ["node_modules", ".next", "dist"] },
  eslintJsPlugin.configs.recommended,
  // ...compat.config({
  //   extends: ["next", "next/core-web-vitals", "next/typescript"],
  // }),
  ...typescriptConfigs,
  {
    plugins: { "@cspell": /** @type {any} */ (cspellPlugin) },
    rules: {
      "@cspell/spellchecker": [
        "warn",
        /** @type {import('@cspell/eslint-plugin').Options} */ ({
          autoFix: true,
          generateSuggestions: true,
          numSuggestions: 3,
          configFile: new URL(
            "./cspell.config.yaml",
            import.meta.url,
          ).toString(),
        }),
      ],
    },
  },
  eslintConfigPrettier,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  {
    rules: {
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": "off",
    },
  },
];

export default eslintConfig;
