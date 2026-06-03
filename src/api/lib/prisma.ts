import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// On réexporte tous les modèles pour faciliter leur utilisatation dans le reste de l'application
export * from "@prisma/client";

export const prisma = new PrismaClient({ adapter });
