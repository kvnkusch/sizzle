import type { Config } from 'drizzle-kit';

export default {
  schema: './libs/db/schema/src/lib/schema.ts',
  out: './libs/db/schema/src/lib/migrations',
} satisfies Config;
