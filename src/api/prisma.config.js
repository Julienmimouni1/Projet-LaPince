import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx ./prisma/seed.ts", // remplacement de node car il ne sait pas lire du TypeScript nativement, il execute que du JS
  },
    datasource: {
    url: process.env.DATABASE_URL 
  },
});

