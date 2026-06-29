import { test } from 'node:test';
import assert from 'node:assert';
import { formatBackendError } from '../bookingErrors.ts';

test('surfaces specific validation detail messages instead of the generic error', () => {
  const body = {
    error: 'Validation failed',
    details: [{ field: 'datetime', message: 'Appointment time must be at least 60 minutes in the future' }],
  };
  assert.equal(
    formatBackendError(body, 400),
    'Appointment time must be at least 60 minutes in the future',
  );
});

test('joins multiple validation details', () => {
  const body = {
    error: 'Validation failed',
    details: [
      { field: 'email', message: 'Invalid email format' },
      { field: 'duration', message: 'duration must be at least 1' },
    ],
  };
  assert.equal(
    formatBackendError(body, 400),
    'Invalid email format; duration must be at least 1',
  );
});

test('falls back to the top-level error when there are no details', () => {
  assert.equal(formatBackendError({ error: "Provider 'x' not found" }, 404), "Provider 'x' not found");
});

test('falls back to an HTTP status message when the body is empty', () => {
  assert.equal(formatBackendError({}, 500), 'Request failed (HTTP 500)');
});
