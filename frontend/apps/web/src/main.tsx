import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { BrowserRouter } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import "@workspace/ui/globals.css"

import { App } from "./App"
import { ThemeProvider } from "./components/theme-provider"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15000,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>

    <ThemeProvider>

      <QueryClientProvider client={queryClient}>

        <BrowserRouter>
          <App />
        </BrowserRouter>

      </QueryClientProvider>

    </ThemeProvider>

  </StrictMode>
)