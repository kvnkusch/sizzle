import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

// TODO: Should this run migrations for all environments?
// If so, how will the config process work?
dotenv.config({
  path: './apps/server/.env.local',
});

async function main() {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const db = drizzle(pool);

    await migrate(db, {
      migrationsFolder: './libs/db/schema/src/lib/migrations',
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
