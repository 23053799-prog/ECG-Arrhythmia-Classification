// API Contract V1
// These interfaces mirror the backend contract.

export type ClassCode = "N" | "S" | "V" | "F" | "Q"

export type SupportLevel =
  | "supported"
  | "experimental"
  | "unsupported"

export type WarningSeverity = "info" | "warning" | "critical"

export interface Warning {
  code: string
  severity: WarningSeverity
  message: string
}

export interface HealthResponse {
  status: "ok"
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

export interface ClassInfo {
  code: ClassCode
  name: string
  short_description: string
  plain_language_explanation: string
  support_level: SupportLevel
  support_note: string | null
}

export interface ReviewProgress {
  reviewed: number
  total: number
  corrected: number
}

export interface RecordSummary {
  record_id: string
  display_name: string
  created_at: string
  expires_at: string | null

  source_format: "wfdb" | "csv"

  original_sampling_rate_hz: number
  model_sampling_rate_hz: 360
  resampled: boolean

  duration_sec: number
  n_samples: number

  lead_used: string
  lead_validated: boolean

  n_beats: number
  n_beats_scored: number
  n_beats_unscored: number

  mean_heart_rate_bpm: number | null
  heart_rate_range_bpm: [number, number] | null

  class_counts_predicted: Record<ClassCode, number>
  class_percent_estimated: Record<ClassCode, number>

  review_progress: ReviewProgress

  warnings: Warning[]

  model: {
    version: string | null
    is_stub: boolean
    calibrated: boolean
  }
}

export interface SignalWindow {
  record_id: string
  start_sec: number
  end_sec: number
  sampling_rate_hz: 360
  lead: string
  y_unit: string | null
  n_points: number
  downsampled: boolean
  t: number[]
  v: number[]
}

export interface Beat {
  beat_id: number
  sample_index: number
  time_sec: number

  scored: boolean

  model_label: ClassCode | null
  probabilities: Record<ClassCode, number> | null
  confidence: number | null

  low_confidence: boolean
  support_level: SupportLevel | null

  final_label: ClassCode | null

  label_source: "model" | "human" | "unlabelled"
  reviewed: boolean

  pre_rr_sec: number | null
  post_rr_sec: number | null

  qc_flags: string[]
}

export interface BeatsResponse {
  items: Beat[]
  total: number
  offset: number
  limit: number
}

export interface TimelineBin {
  start_sec: number
  end_sec: number
  n_beats: number
  counts: Record<ClassCode, number>
}

export interface TimelineResponse {
  bin_sec: number
  bins: TimelineBin[]
}

export interface ModelCard {
  model_version: string | null
  is_stub: boolean

  intended_use: string[]
  not_intended_for: string[]

  disclaimer: string

  training_data: {
    database: string
    n_persons: number | null
    n_records: number | null
    n_beats: number | null
    sampling_rate_hz: 360
    lead: "MLII"
    notes: string[]
  } | null

  evaluation: {
    protocol: string
    headline: Record<string, unknown> | null

    per_class: {
      class: ClassCode
      precision: number
      recall: number
      f1: number
      ci_95?: [number, number]
    }[]

    confusion_matrix: number[][] | null
    notes: string[]
  } | null

  calibration: Record<string, unknown> | null

  class_support: ClassInfo[]

  limitations: string[]

  generated_at: string | null
}

export interface ApiErrorEnvelope {
  error: {
    code: string
    message: string
    details: Record<string, unknown> | null
    request_id: string
  }
}

export type ExportFormat = "csv" | "json" | "physionet"

export interface ExportJsonResponse {
  record: RecordSummary
  model: ModelCard
  disclaimer: string
  beats: Beat[]
}

export interface BeatPatch {
  final_label?: ClassCode | null
  reviewed?: boolean
}

export type BeatSort =
  | "time"
  | "confidence_asc"
  | "confidence_desc"

export interface BeatQuery {
  offset?: number
  limit?: number
  sort?: BeatSort

  start_sec?: number
  end_sec?: number

  model_label?: ClassCode
  final_label?: ClassCode

  reviewed?: boolean
  low_confidence?: boolean
  scored?: boolean
}

export interface SignalQuery {
  start_sec: number
  end_sec: number
  max_points?: number
}