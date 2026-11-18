export type ClassCode = 'N' | 'S' | 'V' | 'F' | 'Q';

export type SupportLevel = 'supported' | 'experimental' | 'unsupported';

export interface Warning {
  code: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
}

// Exact shape of GET /health from API Contract V1.
export interface HealthResponse {
  status: 'ok';
  api_version: string;
  time_utc: string;
  model: {
    loaded: boolean;
    version: string | null;
    is_stub: boolean;
    calibrated: boolean;
    confidence_threshold: number | null;
  };
}
