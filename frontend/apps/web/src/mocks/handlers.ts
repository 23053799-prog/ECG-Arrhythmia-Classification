import { http, HttpResponse } from "msw"

import { API_BASE_URL } from "../lib/constants"
import { endpoints } from "../api/endpoints"

import type { Beat, ClassCode } from "../api/types"

import { mockClasses } from "./data/classes"
import { mockModelCard } from "./data/modelCard"

import {
  createSyntheticRecord,
  generateSignalWindow,
  RECORD_DURATION_SEC,
  SAMPLING_RATE,
} from "./data/syntheticRecord"

import type { SyntheticRecord } from "./data/syntheticRecord"

// --------------------------------------------------
// MOCK DATABASE
// --------------------------------------------------

// Records remain in memory while the browser page is open.
// Reloading the page resets this mock database.

const records = new Map<string, SyntheticRecord>()

// --------------------------------------------------
// COMMON RESPONSE HELPERS
// --------------------------------------------------

function apiHeaders(): HeadersInit {
  return {
    "X-API-Version": "v1",
  }
}

function jsonResponse(
  data: unknown,
  status = 200,
): Response {
  const headers = new Headers(apiHeaders())

  headers.set(
    "Content-Type",
    "application/json; charset=utf-8",
  )

  const body = JSON.stringify(data)

  return new HttpResponse(body ?? "null", {
    status,
    headers,
  })
}

function errorResponse(
  code: string,
  message: string,
  status: number,
  details: Record<string, unknown> | null = null,
): Response {
  const requestId =
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `mock-request-${Date.now()}`

  return jsonResponse(
    {
      error: {
        code,
        message,
        details,
        request_id: requestId,
      },
    },
    status,
  )
}

function invalidRequest(
  message: string,
): Response {
  return errorResponse(
    "INVALID_REQUEST",
    message,
    400,
  )
}

// --------------------------------------------------
// GENERAL HELPERS
// --------------------------------------------------

function getRecord(
  recordId: string,
): SyntheticRecord | undefined {
  return records.get(recordId)
}

function isClassCode(value: unknown): value is ClassCode {
  return (
    value === "N" ||
    value === "S" ||
    value === "V" ||
    value === "F" ||
    value === "Q"
  )
}

function parseOptionalBoolean(
  value: string | null,
): { valid: boolean; value?: boolean } {
  if (value === null) {
    return { valid: true }
  }

  if (value === "true") {
    return { valid: true, value: true }
  }

  if (value === "false") {
    return { valid: true, value: false }
  }

  return { valid: false }
}

function refreshReviewProgress(
  record: SyntheticRecord,
): void {
  const beats = record.beats

  record.summary.review_progress = {
    reviewed: beats.filter((beat) => beat.reviewed).length,
    total: beats.length,
    corrected: beats.filter(
      (beat) => beat.label_source === "human",
    ).length,
  }
}

// --------------------------------------------------
// 1. GET /health
// --------------------------------------------------

const healthHandler = http.get(
  `${API_BASE_URL}${endpoints.health}`,
  () => {
    return jsonResponse({
      status: "ok",
      api_version: "v1",
      time_utc: new Date().toISOString(),

      model: {
        loaded: true,
        version: "mock-stub-v1",
        is_stub: true,
        calibrated: false,
        confidence_threshold: null,
      },
    })
  },
)

// --------------------------------------------------
// 2. GET /classes
// --------------------------------------------------

const classesHandler = http.get(
  `${API_BASE_URL}${endpoints.classes}`,
  () => {
    return jsonResponse(mockClasses)
  },
)

// --------------------------------------------------
// 3. GET /model-card
// --------------------------------------------------

const modelCardHandler = http.get(
  `${API_BASE_URL}${endpoints.modelCard}`,
  () => {
    return jsonResponse(mockModelCard)
  },
)

// --------------------------------------------------
// 4. POST /records
// --------------------------------------------------

const createRecordHandler = http.post(
  `${API_BASE_URL}${endpoints.records}`,
  async ({ request }) => {
    const form = await request.formData()

    const uploadedFiles = form.getAll("files")

    const files = uploadedFiles.filter(
      (item): item is File =>
        item instanceof File && item.name.length > 0,
    )

    if (
      files.length < 1 ||
      files.length > 4 ||
      files.length !== uploadedFiles.length
    ) {
      return invalidRequest(
        "Provide between 1 and 4 valid uploaded files.",
      )
    }

    const extensions = files.map((file) => {
      const match = file.name.match(/\.([^.]+)$/)

      return match?.[1]?.toLowerCase() ?? ""
    })

    const supportedExtensions = [
      "hea",
      "dat",
      "atr",
      "csv",
      "txt",
    ]

    if (
      extensions.some(
        (extension) =>
          !supportedExtensions.includes(extension),
      )
    ) {
      return errorResponse(
        "UNSUPPORTED_FORMAT",
        "The mock server accepts WFDB .hea/.dat files or CSV signal and annotation text files.",
        415,
      )
    }

    const formatValue = form.get("format_hint")

    const formatHint =
      typeof formatValue === "string"
        ? formatValue
        : "auto"

    if (
      !["auto", "wfdb", "csv"].includes(formatHint)
    ) {
      return invalidRequest(
        "format_hint must be auto, wfdb or csv.",
      )
    }

    const hasHeader = extensions.includes("hea")
    const hasData = extensions.includes("dat")
    

    const hasCsv = extensions.includes("csv")
    const hasText = extensions.includes("txt")

    let sourceFormat: "wfdb" | "csv"

    if (formatHint === "wfdb") {
      if (!hasHeader || !hasData) {
        return errorResponse(
          "UNSUPPORTED_FORMAT",
          "WFDB uploads require a .hea header file and a .dat signal file.",
          415,
        )
      }

      sourceFormat = "wfdb"
    } else if (formatHint === "csv") {
      if (!hasCsv) {
        return errorResponse(
          "UNSUPPORTED_FORMAT",
          "A CSV signal file is required.",
          415,
        )
      }

      if (!hasText) {
        return errorResponse(
          "MISSING_ANNOTATIONS",
          "The CSV upload requires an annotation text file.",
          422,
        )
      }

      sourceFormat = "csv"
    } else if (hasHeader && hasData) {
      sourceFormat = "wfdb"
    } else if (hasCsv && hasText) {
      sourceFormat = "csv"
    } else if (hasCsv) {
      return errorResponse(
        "MISSING_ANNOTATIONS",
        "The CSV upload requires an annotation text file.",
        422,
      )
    } else {
      return errorResponse(
        "UNSUPPORTED_FORMAT",
        "The uploaded files do not form a supported WFDB or CSV input.",
        415,
      )
    }

    const samplingRateValue =
      form.get("sampling_rate_hz")

    const samplingRate =
      samplingRateValue === null ||
      samplingRateValue === ""
        ? SAMPLING_RATE
        : Number(samplingRateValue)

    if (
      !Number.isFinite(samplingRate) ||
      samplingRate <= 0
    ) {
      return invalidRequest(
        "sampling_rate_hz must be a positive number.",
      )
    }

    const leadValue = form.get("lead_name")

    const leadName =
      typeof leadValue === "string" && leadValue.trim()
        ? leadValue.trim()
        : "MLII"

    const displayNameValue = form.get("display_name")

    const displayName =
      typeof displayNameValue === "string" &&
      displayNameValue.trim()
        ? displayNameValue.trim()
        : "Synthetic ECG record"

    const recordId = crypto.randomUUID()

    const record = createSyntheticRecord({
      recordId,
      displayName,
      sourceFormat,
      originalSamplingRateHz: samplingRate,
      leadName,
      leadValidated: false,
    })

    records.set(recordId, record)

    return jsonResponse(record.summary, 201)
  },
)

// --------------------------------------------------
// 5. GET /records/:recordId
// --------------------------------------------------

const getRecordHandler = http.get(
  `${API_BASE_URL}/records/:recordId`,
  ({ params }) => {
    const recordId = String(params.recordId)

    const record = getRecord(recordId)

    if (!record) {
      return errorResponse(
        "RECORD_NOT_FOUND",
        "The requested ECG record was not found.",
        404,
      )
    }

    return jsonResponse(record.summary)
  },
)

// --------------------------------------------------
// 6. DELETE /records/:recordId
// --------------------------------------------------

const deleteRecordHandler = http.delete(
  `${API_BASE_URL}/records/:recordId`,
  ({ params }) => {
    const recordId = String(params.recordId)

    if (!records.has(recordId)) {
      return errorResponse(
        "RECORD_NOT_FOUND",
        "The requested ECG record was not found.",
        404,
      )
    }

    records.delete(recordId)

    return new HttpResponse(null, {
      status: 204,
      headers: apiHeaders(),
    })
  },
)

// --------------------------------------------------
// 7. GET /records/:recordId/signal
// --------------------------------------------------

const signalHandler = http.get(
  `${API_BASE_URL}/records/:recordId/signal`,
  ({ params, request }) => {
    const recordId = String(params.recordId)

    const record = getRecord(recordId)

    if (!record) {
      return errorResponse(
        "RECORD_NOT_FOUND",
        "The requested ECG record was not found.",
        404,
      )
    }

    const search = new URL(request.url).searchParams

    const startValue = search.get("start_sec")
    const endValue = search.get("end_sec")
    const maxPointsValue = search.get("max_points")

    if (startValue === null || endValue === null) {
      return invalidRequest(
        "start_sec and end_sec are required.",
      )
    }

    const startSec = Number(startValue)
    const endSec = Number(endValue)

    const maxPoints =
      maxPointsValue === null
        ? 4000
        : Number(maxPointsValue)

    if (
      !Number.isFinite(startSec) ||
      !Number.isFinite(endSec) ||
      !Number.isInteger(maxPoints) ||
      maxPoints < 1
    ) {
      return invalidRequest(
        "Invalid signal window parameters.",
      )
    }

    if (
      startSec < 0 ||
      endSec <= startSec ||
      endSec > RECORD_DURATION_SEC
    ) {
      return invalidRequest(
        "The requested signal time range is invalid.",
      )
    }

    if (endSec - startSec > 120) {
      return invalidRequest(
        "Signal window length cannot exceed 120 seconds.",
      )
    }

    const signal = generateSignalWindow(
      record,
      startSec,
      endSec,
      maxPoints,
    )

    return jsonResponse(signal)
  },
)

// --------------------------------------------------
// 8. GET /records/:recordId/beats
// --------------------------------------------------

const beatsHandler = http.get(
  `${API_BASE_URL}/records/:recordId/beats`,
  ({ params, request }) => {
    const recordId = String(params.recordId)

    const record = getRecord(recordId)

    if (!record) {
      return errorResponse(
        "RECORD_NOT_FOUND",
        "The requested ECG record was not found.",
        404,
      )
    }

    const search = new URL(request.url).searchParams

    const offset = Number(search.get("offset") ?? 0)
    const limit = Number(search.get("limit") ?? 200)

    const sort =
      search.get("sort") ?? "time"

    if (
      !Number.isInteger(offset) ||
      offset < 0 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 1000
    ) {
      return invalidRequest(
        "offset must be non-negative and limit must be between 1 and 1000.",
      )
    }

    if (
      !["time", "confidence_asc", "confidence_desc"].includes(
        sort,
      )
    ) {
      return invalidRequest("Invalid beat sort order.")
    }

    const startValue = search.get("start_sec")
    const endValue = search.get("end_sec")

    const startSec =
      startValue === null ? undefined : Number(startValue)

    const endSec =
      endValue === null ? undefined : Number(endValue)

    if (
      (startSec !== undefined &&
        !Number.isFinite(startSec)) ||
      (endSec !== undefined &&
        !Number.isFinite(endSec)) ||
      (startSec !== undefined && startSec < 0) ||
      (endSec !== undefined && endSec < 0) ||
      (startSec !== undefined &&
        endSec !== undefined &&
        startSec >= endSec)
    ) {
      return invalidRequest(
        "Invalid beat time filter.",
      )
    }

    const modelLabel = search.get("model_label")
    const finalLabel = search.get("final_label")

    if (
      (modelLabel !== null && !isClassCode(modelLabel)) ||
      (finalLabel !== null && !isClassCode(finalLabel))
    ) {
      return invalidRequest(
        "Invalid model_label or final_label.",
      )
    }

    const reviewed = parseOptionalBoolean(
      search.get("reviewed"),
    )

    const lowConfidence = parseOptionalBoolean(
      search.get("low_confidence"),
    )

    const scored = parseOptionalBoolean(
      search.get("scored"),
    )

    if (
      !reviewed.valid ||
      !lowConfidence.valid ||
      !scored.valid
    ) {
      return invalidRequest(
        "Boolean filters must be true or false.",
      )
    }

    let filtered: Beat[] = record.beats.filter((beat) => {
      if (
        startSec !== undefined &&
        beat.time_sec < startSec
      ) {
        return false
      }

      if (
        endSec !== undefined &&
        beat.time_sec >= endSec
      ) {
        return false
      }

      if (
        modelLabel !== null &&
        beat.model_label !== modelLabel
      ) {
        return false
      }

      if (
        finalLabel !== null &&
        beat.final_label !== finalLabel
      ) {
        return false
      }

      if (
        reviewed.value !== undefined &&
        beat.reviewed !== reviewed.value
      ) {
        return false
      }

      if (
        lowConfidence.value !== undefined &&
        beat.low_confidence !== lowConfidence.value
      ) {
        return false
      }

      if (
        scored.value !== undefined &&
        beat.scored !== scored.value
      ) {
        return false
      }

      return true
    })

    if (sort === "confidence_asc") {
      filtered = [...filtered].sort(
        (a, b) =>
          (a.confidence ?? Infinity) -
          (b.confidence ?? Infinity),
      )
    } else if (sort === "confidence_desc") {
      filtered = [...filtered].sort(
        (a, b) =>
          (b.confidence ?? -Infinity) -
          (a.confidence ?? -Infinity),
      )
    } else {
      filtered = [...filtered].sort(
        (a, b) => a.time_sec - b.time_sec,
      )
    }

    return jsonResponse({
      items: filtered.slice(offset, offset + limit),
      total: filtered.length,
      offset,
      limit,
    })
  },
)

// --------------------------------------------------
// 9. PATCH /records/:recordId/beats/:beatId
// --------------------------------------------------

const updateBeatHandler = http.patch(
  `${API_BASE_URL}/records/:recordId/beats/:beatId`,
  async ({ params, request }) => {
    const recordId = String(params.recordId)
    const beatId = Number(params.beatId)

    const record = getRecord(recordId)

    if (!record) {
      return errorResponse(
        "RECORD_NOT_FOUND",
        "The requested ECG record was not found.",
        404,
      )
    }

    if (
      !Number.isInteger(beatId) ||
      beatId < 0 ||
      beatId >= record.beats.length
    ) {
      return errorResponse(
        "BEAT_NOT_FOUND",
        "The requested ECG beat was not found.",
        404,
      )
    }

    let body: unknown

    try {
      body = await request.json()
    } catch {
      return invalidRequest("Request body must be valid JSON.")
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return invalidRequest("Invalid beat update body.")
    }

    const patch = body as Record<string, unknown>

    const hasFinalLabel =
      Object.prototype.hasOwnProperty.call(
        patch,
        "final_label",
      )

    const hasReviewed =
      Object.prototype.hasOwnProperty.call(
        patch,
        "reviewed",
      )

    if (!hasFinalLabel && !hasReviewed) {
      return invalidRequest(
        "At least one of final_label or reviewed is required.",
      )
    }

    if (
      hasFinalLabel &&
      patch.final_label !== null &&
      !isClassCode(patch.final_label)
    ) {
      return invalidRequest(
        "final_label must be N, S, V, F, Q or null.",
      )
    }

    if (
      hasReviewed &&
      typeof patch.reviewed !== "boolean"
    ) {
      return invalidRequest(
        "reviewed must be a boolean.",
      )
    }

    const existing = record.beats[beatId]

    if (!existing) {
      return errorResponse(
        "BEAT_NOT_FOUND",
        "The requested ECG beat was not found.",
        404,
      )
    }

    const updated: Beat = {
      ...existing,
    }

    if (hasFinalLabel) {
      updated.final_label = patch.final_label as
        | ClassCode
        | null

      updated.label_source =
        updated.final_label === existing.model_label
          ? "model"
          : "human"

      updated.reviewed = hasReviewed
        ? (patch.reviewed as boolean)
        : true
    } else if (hasReviewed) {
      updated.reviewed = patch.reviewed as boolean
    }

    record.beats[beatId] = updated

    refreshReviewProgress(record)

    return jsonResponse(updated)
  },
)

// --------------------------------------------------
// 10. GET /records/:recordId/timeline
// --------------------------------------------------

const timelineHandler = http.get(
  `${API_BASE_URL}/records/:recordId/timeline`,
  ({ params, request }) => {
    const recordId = String(params.recordId)

    const record = getRecord(recordId)

    if (!record) {
      return errorResponse(
        "RECORD_NOT_FOUND",
        "The requested ECG record was not found.",
        404,
      )
    }

    const search = new URL(request.url).searchParams

    const binSec = Number(search.get("bin_sec") ?? 60)

    if (
      !Number.isFinite(binSec) ||
      binSec <= 0
    ) {
      return invalidRequest(
        "bin_sec must be a positive number.",
      )
    }

    const bins: {
      start_sec: number
      end_sec: number
      n_beats: number
      counts: Record<ClassCode, number>
    }[] = []

    for (
      let start = 0;
      start < record.summary.duration_sec;
      start += binSec
    ) {
      const end = Math.min(
        record.summary.duration_sec,
        start + binSec,
      )

      const counts: Record<ClassCode, number> = {
        N: 0,
        S: 0,
        V: 0,
        F: 0,
        Q: 0,
      }

      const visibleBeats = record.beats.filter(
        (beat) =>
          beat.time_sec >= start &&
          beat.time_sec < end &&
          beat.final_label !== null,
      )

      for (const beat of visibleBeats) {
        if (beat.final_label !== null) {
          counts[beat.final_label]++
        }
      }

      bins.push({
        start_sec: start,
        end_sec: end,
        n_beats: visibleBeats.length,
        counts,
      })
    }

    return jsonResponse({
      bin_sec: binSec,
      bins,
    })
  },
)

// --------------------------------------------------
// CSV EXPORT HELPERS
// --------------------------------------------------

function csvCell(value: string | number | boolean | null): string {
  const text = value === null ? "" : String(value)

  return `"${text.replace(/"/g, '""')}"`
}

function createCsv(record: SyntheticRecord): string {
  const columns = [
    "beat_id",
    "sample_index",
    "time_sec",
    "model_label",
    "prob_N",
    "prob_S",
    "prob_V",
    "prob_F",
    "prob_Q",
    "confidence",
    "low_confidence",
    "final_label",
    "label_source",
    "reviewed",
    "qc_flags",
  ]

  const rows = record.beats.map((beat) => {
    const probabilities = beat.probabilities

    return [
      beat.beat_id,
      beat.sample_index,
      beat.time_sec,
      beat.model_label,
      probabilities?.N ?? null,
      probabilities?.S ?? null,
      probabilities?.V ?? null,
      probabilities?.F ?? null,
      probabilities?.Q ?? null,
      beat.confidence,
      beat.low_confidence,
      beat.final_label,
      beat.label_source,
      beat.reviewed,
      beat.qc_flags.join("|"),
    ]
      .map(csvCell)
      .join(",")
  })

  return [
    columns.map(csvCell).join(","),
    ...rows,
  ].join("\r\n")
}

// --------------------------------------------------
// 11. GET /records/:recordId/export
// --------------------------------------------------

const exportHandler = http.get(
  `${API_BASE_URL}/records/:recordId/export`,
  ({ params, request }) => {
    const recordId = String(params.recordId)

    const record = getRecord(recordId)

    if (!record) {
      return errorResponse(
        "RECORD_NOT_FOUND",
        "The requested ECG record was not found.",
        404,
      )
    }

    const search = new URL(request.url).searchParams

    const format = search.get("format") ?? "csv"

    if (
      format !== "csv" &&
      format !== "json" &&
      format !== "physionet"
    ) {
      return invalidRequest(
        "Export format must be csv, json or physionet.",
      )
    }

    // WFDB export is not simulated.
    // Do not claim PhysioNet support without verifying
    // the actual backend's WFDB implementation.

    if (format === "physionet") {
      return errorResponse(
        "INVALID_REQUEST",
        "PhysioNet export is not implemented by the frontend mock server. Verify the real backend's WFDB export before enabling it.",
        400,
      )
    }

    if (format === "json") {
      return new HttpResponse(
        JSON.stringify(
          {
            record: record.summary,
            model: mockModelCard,
            disclaimer: mockModelCard.disclaimer,
            beats: record.beats,
          },
          null,
          2,
        ),
        {
          status: 200,
          headers: {
            ...apiHeaders(),
            "Content-Type": "application/json; charset=utf-8",
            "Content-Disposition": 'attachment; filename="ecg-export.json"',
          },
        },
      )
    }

    return new HttpResponse(createCsv(record), {
      status: 200,
      headers: {
        ...apiHeaders(),
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="ecg-export.csv"',
      },
    })
  },
)

// --------------------------------------------------
// EXPORT ALL ROUTE HANDLERS
// --------------------------------------------------

export const handlers = [
  healthHandler,
  classesHandler,
  modelCardHandler,
  createRecordHandler,
  getRecordHandler,
  deleteRecordHandler,
  signalHandler,
  beatsHandler,
  updateBeatHandler,
  timelineHandler,
  exportHandler,
]