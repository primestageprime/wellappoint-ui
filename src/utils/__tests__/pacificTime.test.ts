import { test } from 'node:test';
import assert from 'node:assert';
import { formatStartForBackend } from '../pacificTime.ts';

// These must hold no matter what timezone the browser/runner is in.
// We run the suite under TZ=America/New_York to prove independence.

test('formats an instant as Pacific wall-clock, not local', () => {
  // 2026-06-29T18:30:00Z === 11:30 PDT (UTC-7). Eastern local would read 14:30.
  assert.equal(formatStartForBackend('2026-06-29T18:30:00Z'), '2026-06-29 11:30');
});

test('handles Pacific midnight as 00:00 and correct date', () => {
  // 2026-06-29T07:00:00Z === 00:00 PDT June 29.
  assert.equal(formatStartForBackend('2026-06-29T07:00:00Z'), '2026-06-29 00:00');
});

test('uses the Pacific calendar date across the UTC day boundary', () => {
  // 2026-06-29T05:30:00Z === 22:30 PDT on June 28 (previous Pacific day).
  assert.equal(formatStartForBackend('2026-06-29T05:30:00Z'), '2026-06-28 22:30');
});
