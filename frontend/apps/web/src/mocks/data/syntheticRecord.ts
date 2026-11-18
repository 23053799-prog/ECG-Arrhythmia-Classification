import type {
  Beat,
  ClassCode,
  RecordSummary,
  SignalWindow,
  SupportLevel,
  Warning,
} from "../../api/types"

import { mockClasses } from "./classes"

export const SAMPLING_RATE = 360

export const RECORD_DURATION_SEC = 30 * 60

export const TOTAL_SAMPLES =
  SAMPLING_RATE * RECORD_DURATION_SEC

export const TOTAL_SYNTHETIC_BEATS = 2000

const RECORD_START_SEC = 0.12

const RECORD_END_SEC = RECORD_DURATION_SEC - 0.12

const CLASS_CODES: ClassCode[] = [
  "N",
  "S",
  "V",
  "F",
  "Q",
]

export interface SyntheticRecord {
  summary: RecordSummary
  beats: Beat[]
}

export interface SyntheticRecordOptions {
  recordId?: string
  displayName?: string

  sourceFormat?: "wfdb" | "csv"

  originalSamplingRateHz?: number

  leadName?: string

  leadValidated?: boolean
}

const supportByCode = new Map<ClassCode, SupportLevel>(
  mockClasses.map((item) => [
    item.code,
    item.support_level,
  ]as const),
)

function createRecordId(): string {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID()
  }

  return `mock-record-${Date.now()}`
}

function createEmptyCounts(): Record<ClassCode, number> {
  return {
    N: 0,
    S: 0,
    V: 0,
    F: 0,
    Q: 0,
  }
}

function round(value: number, digits = 3): number {
  const factor = 10 ** digits

  return Math.round(value * factor) / factor
}

// Generate evenly distributed but slightly variable
// synthetic beat intervals across the 30-minute record.

function generateBeatTimes(): number[] {
  const intervals: number[] = []

  for (let i = 0; i < TOTAL_SYNTHETIC_BEATS - 1; i++) {
    const interval =
      0.9 +
      0.035 * Math.sin(i * 0.173) +
      0.018 * Math.cos(i * 0.071)

    intervals.push(interval)
  }

  const totalInterval = intervals.reduce(
    (sum, value) => sum + value,
    0,
  )

  const targetInterval =
    RECORD_END_SEC - RECORD_START_SEC

  const scale = targetInterval / totalInterval

  const times: number[] = [RECORD_START_SEC]

  for (const interval of intervals) {
    times.push(times[times.length - 1] + interval * scale)
  }

  return times
}

// These are synthetic model suggestions for testing.
// They are NOT generated from clinical annotations.

function generateMockLabel(index: number): ClassCode {
  if (index > 0 && index % 997 === 0) {
    return "F"
  }

  if (index > 0 && index % 83 === 0) {
    return "S"
  }

  if (index > 0 && index % 47 === 0) {
    return "Q"
  }

  if (index > 0 && index % 11 === 0) {
    return "V"
  }

  return "N"
}

function deterministicUnit(index: number): number {
  const value = Math.sin((index + 1) * 12.9898) * 43758.5453

  return value - Math.floor(value)
}

function generateProbabilities(
  label: ClassCode,
  index: number,
  confidence: number,
): Record<ClassCode, number> {
  const otherClasses = CLASS_CODES.filter(
    (code) => code !== label,
  )

  const weights = otherClasses.map((_, i) => {
    return (
      0.5 +
      Math.abs(
        Math.sin((index + 1) * (i + 1) * 0.37),
      )
    )
  })

  const totalWeight = weights.reduce(
    (sum, value) => sum + value,
    0,
  )

  const remaining = 1 - confidence

  const probabilities = createEmptyCounts() as Record<
    ClassCode,
    number
  >

  probabilities[label] = confidence

  otherClasses.forEach((code, i) => {
    probabilities[code] =
      (remaining * weights[i]) / totalWeight
  })

  return probabilities
}

function generateWarnings(
  originalSamplingRateHz: number,
): Warning[] {
  const warnings: Warning[] = [
    {
      code: "STUB_MODEL",
      severity: "warning",
      message:
        "Synthetic data is being served by the frontend mock server. No production model was executed.",
    },
    {
      code: "LEAD_NOT_VALIDATED",
      severity: "warning",
      message:
        "The mock server has not clinically validated the signal lead.",
    },
    {
      code: "BEATS_NOT_SCORED_EDGE",
      severity: "info",
      message:
        "Some record-edge beats are unscored because their 201-sample windows are incomplete.",
    },
    {
      code: "MODEL_NOT_CALIBRATED",
      severity: "warning",
      message:
        "Confidence scores are not calibrated.",
    },
  ]

  if (originalSamplingRateHz !== SAMPLING_RATE) {
    warnings.push({
      code: "RESAMPLED_TO_360HZ",
      severity: "info",
      message:
        "The synthetic mock signal is represented at the 360 Hz model sampling rate.",
    })
  }

  return warnings
}

function generateBeats(times: number[]): Beat[] {
  return times.map<Beat>((time, index) => {
    const sampleIndex = Math.round(
      time * SAMPLING_RATE,
    )

    // The model requires a complete 201-sample window.
    const scored =
      sampleIndex >= 100 &&
      sampleIndex + 100 < TOTAL_SAMPLES

    const previousTime =
      index > 0 ? times[index - 1] : null

    const nextTime =
      index < times.length - 1
        ? times[index + 1]
        : null

    const preRR =
      previousTime !== null
        ? time - previousTime
        : null

    const postRR =
      nextTime !== null
        ? nextTime - time
        : null

    if (!scored) {
      return {
        beat_id: index,
        sample_index: sampleIndex,
        time_sec: round(sampleIndex / SAMPLING_RATE),

        scored: false,

        model_label: null,
        probabilities: null,
        confidence: null,

        low_confidence: false,
        support_level: null,

        final_label: null,

        label_source: "unlabelled",
        reviewed: false,

        pre_rr_sec: preRR === null ? null : round(preRR),
        post_rr_sec: postRR === null ? null : round(postRR),

        qc_flags: ["INCOMPLETE_WINDOW"],
      }
    }

    const modelLabel = generateMockLabel(index)

    const confidence = round(
      0.54 + deterministicUnit(index) * 0.43,
      4,
    )

    const probabilities = generateProbabilities(
      modelLabel,
      index,
      confidence,
    )

    const supportLevel =
      supportByCode.get(modelLabel) ?? null

    const qcFlags: string[] = []

    if (index % 173 === 0) {
      qcFlags.push("RR_INTERVAL_MASKED")
    }

    if (confidence < 0.7) {
      qcFlags.push("LOW_CONFIDENCE")
    }

    return {
      beat_id: index,
      sample_index: sampleIndex,
      time_sec: round(sampleIndex / SAMPLING_RATE),

      scored: true,

      model_label: modelLabel,
      probabilities,
      confidence,

      low_confidence: confidence < 0.7,

      support_level: supportLevel,

      final_label: modelLabel,

      label_source: "model",
      reviewed: false,

      pre_rr_sec: preRR === null ? null : round(preRR),
      post_rr_sec: postRR === null ? null : round(postRR),

      qc_flags: qcFlags,
    }
  })
}

function generateSummary(
  beats: Beat[],
  options: SyntheticRecordOptions,
): RecordSummary {
  const originalSamplingRate =
    options.originalSamplingRateHz ?? SAMPLING_RATE

  const classCounts = createEmptyCounts()

  const scoredBeats = beats.filter(
    (beat) => beat.scored,
  )

  for (const beat of scoredBeats) {
    if (beat.model_label !== null) {
      classCounts[beat.model_label]++
    }
  }

  const totalScored = scoredBeats.length

  const estimatedPercentages = createEmptyCounts()

  for (const code of CLASS_CODES) {
    estimatedPercentages[code] =
      totalScored > 0
        ? round(
            (classCounts[code] / totalScored) * 100,
            1,
          )
        : 0
  }

  const intervals = beats
    .slice(1)
    .map(
      (beat, index) =>
        beat.time_sec - beats[index].time_sec,
    )

  const minRR = Math.min(...intervals)
  const maxRR = Math.max(...intervals)

  const averageRR =
    intervals.reduce((sum, value) => sum + value, 0) /
    intervals.length

  const resampled =
    originalSamplingRate !== SAMPLING_RATE

  return {
    record_id: options.recordId ?? createRecordId(),

    display_name:
      options.displayName ?? "Synthetic ECG record",

    created_at: new Date().toISOString(),

    expires_at: null,

    source_format: options.sourceFormat ?? "csv",

    original_sampling_rate_hz: originalSamplingRate,

    model_sampling_rate_hz: SAMPLING_RATE,

    resampled,

    duration_sec: RECORD_DURATION_SEC,

    n_samples: TOTAL_SAMPLES,

    lead_used: options.leadName ?? "MLII",

    lead_validated: options.leadValidated ?? false,

    n_beats: beats.length,

    n_beats_scored: totalScored,

    n_beats_unscored: beats.length - totalScored,

    mean_heart_rate_bpm: round(60 / averageRR, 1),

    heart_rate_range_bpm: [
      Math.round(60 / maxRR),
      Math.round(60 / minRR),
    ],

    class_counts_predicted: classCounts,

    class_percent_estimated: estimatedPercentages,

    review_progress: {
      reviewed: beats.filter((beat) => beat.reviewed).length,
      total: beats.length,
      corrected: beats.filter(
        (beat) => beat.label_source === "human",
      ).length,
    },

    warnings: generateWarnings(originalSamplingRate),

    model: {
      version: "mock-stub-v1",
      is_stub: true,
      calibrated: false,
    },
  }
}

export function createSyntheticRecord(
  options: SyntheticRecordOptions = {},
): SyntheticRecord {
  const times = generateBeatTimes()

  const beats = generateBeats(times)

  const summary = generateSummary(beats, options)

  return {
    summary,
    beats,
  }
}

// Synthetic waveform generator.
// It creates only the requested time window.
// The values are illustrative arbitrary units, not clinical ECG data.

function gaussian(
  time: number,
  center: number,
  width: number,
): number {
  const distance = time - center

  return Math.exp(
    -(distance * distance) / (2 * width * width),
  )
}

function waveformValue(
  time: number,
  sampleIndex: number,
  beatCursor: number,
  beats: Beat[],
): number {
  let value =
    0.015 * Math.sin(2 * Math.PI * 0.33 * time) +
    0.008 * Math.sin(2 * Math.PI * 0.08 * time)

  // Small deterministic background variation.
  value += 0.003 * Math.sin(sampleIndex * 0.73)

  for (
    let i = beatCursor;
    i < beats.length && beats[i].time_sec <= time + 0.4;
    i++
  ) {
    const beat = beats[i]
    const dt = time - beat.time_sec

    const amplitude =
      beat.model_label === "V" ? 0.82 : 1

    value +=
      0.10 * gaussian(dt, -0.16, 0.035) +
      -0.12 * gaussian(dt, -0.018, 0.009) +
      amplitude * gaussian(dt, 0, 0.012) +
      -0.22 * gaussian(dt, 0.025, 0.012) +
      0.28 * gaussian(dt, 0.24, 0.065)
  }

  return value
}

function minMaxDecimate(
  times: number[],
  values: number[],
  maxPoints: number,
): {
  t: number[]
  v: number[]
} {
  if (times.length <= maxPoints) {
    return {
      t: times,
      v: values,
    }
  }

  const bucketCount = Math.floor(maxPoints / 2)

  const outputT: number[] = []
  const outputV: number[] = []

  for (let bucket = 0; bucket < bucketCount; bucket++) {
    const start = Math.floor(
      (bucket * times.length) / bucketCount,
    )

    const end = Math.floor(
      ((bucket + 1) * times.length) / bucketCount,
    )

    if (start >= end) {
      continue
    }

    let minIndex = start
    let maxIndex = start

    for (let i = start + 1; i < end; i++) {
      if (values[i] < values[minIndex]) {
        minIndex = i
      }

      if (values[i] > values[maxIndex]) {
        maxIndex = i
      }
    }

    // Keep minimum and maximum in their original time order.
    const first = Math.min(minIndex, maxIndex)
    const second = Math.max(minIndex, maxIndex)

    outputT.push(times[first])
    outputV.push(values[first])

    if (second !== first) {
      outputT.push(times[second])
      outputV.push(values[second])
    }
  }

  return {
    t: outputT,
    v: outputV,
  }
}

export function generateSignalWindow(
  record: SyntheticRecord,
  startSec: number,
  endSec: number,
  maxPoints = 4000,
): SignalWindow {
  const startSample = Math.max(
    0,
    Math.floor(startSec * SAMPLING_RATE),
  )

  const endSample = Math.min(
    TOTAL_SAMPLES,
    Math.ceil(endSec * SAMPLING_RATE),
  )

  const times: number[] = []
  const values: number[] = []

  let beatCursor = 0

  for (
    let sampleIndex = startSample;
    sampleIndex < endSample;
    sampleIndex++
  ) {
    const time = sampleIndex / SAMPLING_RATE

    while (
      beatCursor < record.beats.length &&
      record.beats[beatCursor].time_sec < time - 0.4
    ) {
      beatCursor++
    }

    times.push(time)

    values.push(
      waveformValue(
        time,
        sampleIndex,
        beatCursor,
        record.beats,
      ),
    )
  }

  const decimated = minMaxDecimate(
    times,
    values,
    maxPoints,
  )

  return {
    record_id: record.summary.record_id,

    start_sec: startSec,
    end_sec: endSec,

    sampling_rate_hz: SAMPLING_RATE,

    lead: record.summary.lead_used,

    y_unit: "a.u.",

    n_points: decimated.t.length,

    downsampled: times.length > maxPoints,

    t: decimated.t,
    v: decimated.v,
  }
}