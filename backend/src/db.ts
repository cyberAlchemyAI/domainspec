import { Pool } from "pg";

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/domainspec";

export const dbPool = new Pool({
  connectionString: DATABASE_URL,
});

export async function checkDatabaseConnection(): Promise<{
  ok: boolean;
  reason?: string;
}> {
  try {
    const client = await dbPool.connect();
    try {
      await client.query("select 1");
      return { ok: true };
    } finally {
      client.release();
    }
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}
