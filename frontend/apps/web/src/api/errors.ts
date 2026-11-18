import type { ApiErrorEnvelope } from "./types"

const ERROR_MESSAGES: Record<string, string> = {
  UNSUPPORTED_FORMAT:
    "The uploaded file format is not supported. Check the required input formats.",

  MISSING_ANNOTATIONS:
    "Required beat annotations were not found in the uploaded files.",

  SIGNAL_TOO_SHORT:
    "The ECG signal is too short to process.",

  UNSUPPORTED_LEAD:
    "The uploaded ECG lead is not supported.",

  UNSUPPORTED_SAMPLING_RATE:
    "The supplied sampling rate is not supported.",

  ANNOTATION_MISMATCH:
    "The beat annotations do not match the uploaded signal.",

  FILE_TOO_LARGE:
    "The uploaded file exceeds the permitted server limit.",

  INVALID_REQUEST:
    "The request contains invalid or missing information.",

  RECORD_NOT_FOUND:
    "The requested ECG record could not be found.",

  BEAT_NOT_FOUND:
    "The requested ECG beat could not be found.",

  MODEL_NOT_LOADED:
    "The model is not currently available.",

  INTERNAL_ERROR:
    "An unexpected server error occurred. Please try again later.",
}

export class ApiError extends Error {
  readonly code: string
  readonly status: number
  readonly details: Record<string, unknown> | null
  readonly requestId: string
  readonly apiVersion: string | null

  constructor(
    code: string,
    message: string,
    status: number,
    details: Record<string, unknown> | null = null,
    requestId = "",
    apiVersion: string | null = null,
  ) {
    super(ERROR_MESSAGES[code] ?? message)

    this.name = "ApiError"
    this.code = code
    this.status = status
    this.details = details
    this.requestId = requestId
    this.apiVersion = apiVersion
  }
}

export async function createApiError(
  response: Response,
): Promise<ApiError> {
  let payload: ApiErrorEnvelope | null = null

  try {
    payload = (await response.json()) as ApiErrorEnvelope
  } catch {
    // The response did not contain valid JSON.
  }

  const serverError = payload?.error

  return new ApiError(
    serverError?.code ?? "UNKNOWN_ERROR",
    serverError?.message ?? "The server returned an unexpected response.",
    response.status,
    serverError?.details ?? null,
    serverError?.request_id ?? "",
    response.headers.get("X-API-Version"),
  )
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return "An unexpected error occurred."
}