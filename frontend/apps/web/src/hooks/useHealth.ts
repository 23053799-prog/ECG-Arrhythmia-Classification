import { useQuery } from "@tanstack/react-query"

export interface HealthResponse {
  status: string
  api_version: string
  time_utc: string
  model: {
    loaded: boolean
    version: string | null
    is_stub: boolean
    calibrated: boolean
    confidence_threshold: number | null
  }
}

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8000/api/v1"
).replace(/\/+$/, "")

async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`)

  if (!response.ok) {
    throw new Error(`Health request failed: ${response.status}`)
  }

  return response.json() as Promise<HealthResponse>
}

export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
    retry: false,
    refetchInterval: 30000,
  })
}