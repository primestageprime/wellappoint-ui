// Shape of the backend's JSON error responses (see wellappoint:
// utils/endpoint-helpers.ts -> handleActionResult). Validation failures return
// HTTP 400 with a generic `error` plus a `details` array carrying the real,
// field-level reason. The UI must surface `details`, otherwise the client only
// ever sees the unhelpful "Validation failed".
export interface BackendValidationDetail {
  field: string;
  message: string;
}

export interface BackendErrorBody {
  error?: string;
  details?: BackendValidationDetail[];
}

/**
 * Turn a backend error response into a single user-facing message, preferring
 * the specific validation details over the generic top-level error.
 */
export function formatBackendError(body: BackendErrorBody, status: number): string {
  const details = body.details?.map((d) => d.message).filter(Boolean) ?? [];
  if (details.length > 0) {
    return details.join('; ');
  }
  if (body.error) {
    return body.error;
  }
  return `Request failed (HTTP ${status})`;
}
