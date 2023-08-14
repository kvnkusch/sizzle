import { createTRPCReact } from '@trpc/react-query';
import type { TrpcRouter } from '@sizzle/trpc-server';

export const trpc = createTRPCReact<TrpcRouter>();
