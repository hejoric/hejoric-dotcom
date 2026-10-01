// Prisma CLI configuration (generate, db push, migrate, seed). Prisma 7 no
// longer reads connection URLs from schema.prisma or loads .env on its own.
//
// The CLI uses the DIRECT Neon URL: migrations and introspection need a real
// session, which the PgBouncer pooler cannot give them. The app itself
// connects through the pooled DATABASE_URL in lib/prisma.ts.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Not env("..."), which throws when the variable is unset: `prisma
    // generate` (the postinstall, and CI's `npm ci`) needs no database.
    url: process.env.DATABASE_URL_UNPOOLED ?? "",
  },
});
