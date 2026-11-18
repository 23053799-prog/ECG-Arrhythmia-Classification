import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { BrowserRouter } from "react-router"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

import "@workspace/ui/globals.css"

import { App } from "./App"
import { ThemeProvider } from "./components/theme-provider"
import { USE_MOCKS } from "./lib/constants"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15000,
      refetchOnWindowFocus: false,
    },
  },
})

async function bootstrap() {
  // Start MSW before React makes any API requests.
  if (USE_MOCKS) {
    const { worker } = await import("./mocks/browser")

    await worker.start({
      onUnhandledFrame: "bypass",

      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
    })
  }

  const rootElement = document.getElementById("root")

  if (!rootElement) {
    throw new Error("Root element was not found.")
  }

  createRoot(rootElement).render(
    <StrictMode>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>,
  )
}

void bootstrap()