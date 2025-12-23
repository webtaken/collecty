import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Get connection string - will be empty during build but available at runtime
const connectionString = process.env.DATABASE_URL || "";

// Create postgres connection (empty string won't connect during build)
const client = postgres(connectionString, {
  max: connectionString ? 10 : 0, // No connections if no URL
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create drizzle database instance
export const db = drizzle(client, { schema });

// Export schema for convenience
export * from "./schema";
