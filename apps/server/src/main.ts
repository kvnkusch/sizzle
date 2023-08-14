import fastify from 'fastify';
import { TrpcContext, trpcRouter } from '@sizzle/trpc-server';
import {
  CreateFastifyContextOptions,
  fastifyTRPCPlugin,
} from '@trpc/server/adapters/fastify';
import { environment } from './environments/environment';
import cors from '@fastify/cors';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

const server = fastify({
  maxParamLength: 5000,
  logger: true,
});

server.register(cors, {
  origin: (origin, cb) => {
    cb(null, true);
    return;
  },
  // TODO: Set allowed origin values
  // credentials: true,
});

const createContext = async ({
  req,
  res,
}: CreateFastifyContextOptions): Promise<TrpcContext> => {
  const pool = new Pool({
    connectionString: environment.DATABASE_URL,
  });

  return {
    db: drizzle(pool),
  };
};

server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: { router: trpcRouter, createContext },
});

(async () => {
  try {
    await server.listen({ port: environment.PORT, host: environment.HOST });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
