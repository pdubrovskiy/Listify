import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

export function renderWithProviders(ui: ReactNode) {
  const testQueryClient = createTestQueryClient();

  return {
    ...render(
      <BrowserRouter>
        <QueryClientProvider client={testQueryClient}>
          <ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>
        </QueryClientProvider>
      </BrowserRouter>
    ),
    testQueryClient,
  };
}
