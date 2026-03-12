import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const db = drizzle(process.env.DATABASE_URL);
// await migrate(db, { migrationsFolder: "drizzle" });

// telegram required verification
import { z } from "zod";
export const tgHeadersSchema = z.object({
  "x-tg-user-id": z.coerce.number().int().positive(),
  "x-bot-secret": z.string().min(1),
});
