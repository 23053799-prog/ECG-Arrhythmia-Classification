const configuredApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.trim()

export const API_BASE_URL = (
  configuredApiBaseUrl || "http://localhost:8000/api/v1"
).replace(/\/+$/, "")

export const USE_MOCKS =
  import.meta.env.VITE_USE_MOCKS === "true"