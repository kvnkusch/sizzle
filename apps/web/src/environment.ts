/// <reference types="vite/client" />
import { z } from 'zod';

const envVariablesSchema = z.object({
  VITE_API_URL: z.string(),
});

export const environment = envVariablesSchema.parse(import.meta.env);
