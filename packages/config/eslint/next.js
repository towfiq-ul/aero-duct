import { FlatCompat } from "@eslint/eslintrc";
import base from "./base.js";

const compat = new FlatCompat();

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...base,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@next/next/no-html-link-for-pages": "error",
    },
  },
];
