import { QueryClient } from "@tanstack/react-query";

async function throwIfNotOk(response: Response) {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`HTTP Error: ${response.status} - ${body}`);
  }
}

async function apiRequest(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  await throwIfNotOk(response);

  if (response.headers.get("Content-Type")?.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = queryKey[0] as string;
        const response = await fetch(url);
        await throwIfNotOk(response);

        if (response.headers.get("Content-Type")?.includes("application/json")) {
          return response.json();
        }

        return response.text();
      },
      staleTime: 1000 * 60,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export { apiRequest };
