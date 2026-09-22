import "dotenv/config";
import { PrismaClient } from '../generated/prisma/index.js'; // Custom path from schema
import { PrismaPg } from "@prisma/adapter-pg";


if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Copy .env.example to .env first.");
}

// Create one shared client. Prisma 7 uses a driver adapter to talk to Postgres.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
export default prisma;
