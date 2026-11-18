// TODO(phase F2): Map the API Contract V1 error envelope and error codes
// to user-friendly messages. This basic fallback is used by the F1 shell.
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred.';
}
