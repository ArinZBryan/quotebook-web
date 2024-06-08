import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite", // "mysql" | "sqlite" | "postgresql"
  schema: "./src/schema.ts",
  out: "./drizzle",
  dbCredentials: { 
    url: process.env.SQLITE_URL!,
    authToken: process.env.SQLITE_TOKEN!
  }
});