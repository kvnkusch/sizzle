import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '@sizzle/trpc-client';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import superjson from 'superjson';
import { HomePage } from './pages/home';
import { environment } from '../environment';

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: environment.VITE_API_URL,
          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              // authorization: getAuthCookie(),
            };
          },
          fetch(url, options) {
            return fetch(url, {
              ...options,
              // TODO: Restore this when getting cors working w/o wildcard (*) origin matching
              // credentials: 'include',
            });
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <HomePage />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
