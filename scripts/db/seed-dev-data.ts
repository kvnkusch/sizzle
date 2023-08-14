import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { seedDatabase } from '@sizzle/db/seed';

dotenv.config({
  path: './.env.local',
});

async function main() {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const db = drizzle(pool);

    await seedDatabase(db);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
