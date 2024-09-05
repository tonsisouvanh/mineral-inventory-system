'use client';

import { QueryClientProvider, QueryClient, DefaultOptions } from '@tanstack/react-query';
import { useState } from 'react';

const defaultQueryClientOptions: DefaultOptions = {
  queries: {
    staleTime: 1000 * 60 * 2, // 2 minute
    retry: 2, // Retry failed requests up to 3 times
    // refetchOnWindowFocus: false, // Disable refetch on window focus
    refetchOnReconnect: true, // Refetch on reconnect
    refetchOnMount: false, // Disable refetch on mount
  },
  // mutations: {
  //   retry: 2, // Retry failed mutations up to 3 times
  // },
};

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  // const [queryClient] = useState(() => new QueryClient());
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: defaultQueryClientOptions }));

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;
