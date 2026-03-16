import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const db = drizzle(process.env.DATABASE_URL);
if (process.env.NODE_ENV === "production") {
  (async () => {
    try {
      await migrate(db, { migrationsFolder: "drizzle" });
      console.log("Migrations applied successfully.");
    } catch (err) {
      console.error("Migration failed:", err);
      process.exit(1);
    }
  })();
}
