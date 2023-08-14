import 'dotenv';
import { z } from 'zod';

const envVariablesSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.string().transform((port) => parseInt(port)),
  HOST: z.string(),
});

export const environment = envVariablesSchema.parse(process.env);
