import { API_BASE_URL } from '@/lib/constants';
import { endpoints } from '@/api/endpoints';
import type { HealthResponse } from '@/api/types';

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}${endpoints.health}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`GET /health failed with HTTP ${response.status}`);
  }

  return (await response.json()) as HealthResponse;
}
