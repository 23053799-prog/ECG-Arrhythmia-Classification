import { API_BASE_URL } from "../lib/constants.ts"

import { endpoints } from "./endpoints"

import { createApiError } from "./errors"

import type {
  Beat,
  BeatPatch,
  BeatQuery,
  BeatsResponse,
  ClassInfo,
  ExportFormat,
  HealthResponse,
  ModelCard,
  RecordSummary,
  SignalQuery,
  SignalWindow,
  TimelineResponse,
} from "./types"

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers)

  headers.set("Accept", "application/json")

  const isFormData =
    typeof FormData !== "undefined" &&
    options.body instanceof FormData

  if (options.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw await createApiError(response)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

function buildQuery(
  values: Record<string, string | number | boolean | undefined>,
): string {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined) {
      params.set(key, String(value))
    }
  }

  const query = params.toString()

  return query ? `?${query}` : ""
}

// HEALTH

export function getHealth(): Promise<HealthResponse> {
  return request(endpoints.health)
}

// CLASSES

export function getClasses(): Promise<ClassInfo[]> {
  return request(endpoints.classes)
}

// MODEL CARD

export function getModelCard(): Promise<ModelCard> {
  return request(endpoints.modelCard)
}

// RECORD CREATION

export function createRecord(
  formData: FormData,
): Promise<RecordSummary> {
  return request(endpoints.records, {
    method: "POST",
    body: formData,
  })
}

// RECORD DETAILS

export function getRecord(
  recordId: string,
): Promise<RecordSummary> {
  return request(endpoints.record(recordId))
}

// RECORD DELETION

export function deleteRecord(
  recordId: string,
): Promise<void> {
  return request(endpoints.record(recordId), {
    method: "DELETE",
  })
}

// SIGNAL WINDOW

export function getSignalWindow(
  recordId: string,
  query: SignalQuery,
): Promise<SignalWindow> {
  const search = buildQuery({
    start_sec: query.start_sec,
    end_sec: query.end_sec,
    max_points: query.max_points ?? 4000,
  })

  return request(
    `${endpoints.signal(recordId)}${search}`,
  )
}

// BEATS

export function getBeats(
  recordId: string,
  query: BeatQuery = {},
): Promise<BeatsResponse> {
  const search = buildQuery({
    offset: query.offset ?? 0,
    limit: query.limit ?? 200,
    sort: query.sort ?? "time",

    start_sec: query.start_sec,
    end_sec: query.end_sec,

    model_label: query.model_label,
    final_label: query.final_label,

    reviewed: query.reviewed,
    low_confidence: query.low_confidence,
    scored: query.scored,
  })

  return request(
    `${endpoints.beats(recordId)}${search}`,
  )
}

// UPDATE ONE BEAT

export function updateBeat(
  recordId: string,
  beatId: number,
  patch: BeatPatch,
): Promise<Beat> {
  return request(
    endpoints.beat(recordId, beatId),
    {
      method: "PATCH",
      body: JSON.stringify(patch),
    },
  )
}

// TIMELINE

export function getTimeline(
  recordId: string,
  binSec = 60,
): Promise<TimelineResponse> {
  const search = buildQuery({
    bin_sec: binSec,
  })

  return request(
    `${endpoints.timeline(recordId)}${search}`,
  )
}

// EXPORT

export async function downloadExport(
  recordId: string,
  format: ExportFormat,
): Promise<{
  blob: Blob
  filename: string
}> {
  const search = buildQuery({ format })

  const response = await fetch(
    `${API_BASE_URL}${endpoints.export(recordId)}${search}`,
    {
      headers: {
        Accept: "*/*",
      },
    },
  )

  if (!response.ok) {
    throw await createApiError(response)
  }

  const disposition = response.headers.get("Content-Disposition")

  const filenameMatch = disposition?.match(
    /filename="?([^";]+)"?/i,
  )

  const extension = format === "physionet" ? "atr" : format

  return {
    blob: await response.blob(),
    filename: filenameMatch?.[1] ?? `ecg-export.${extension}`,
  }
}