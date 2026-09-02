// Flat config, required as of ESLint 9 and the default for
// @next/eslint-plugin-next in Next 16. Replaces .eslintrc.json, and
// `npm run lint` now calls the ESLint CLI because `next lint` was removed.
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
