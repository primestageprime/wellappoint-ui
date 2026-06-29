// The backend parses appointment `start` strings strictly as America/Los_Angeles
// (see wellappoint: utils/validation-helpers.ts and appointment-processor.ts).
// The browser must therefore emit the slot's wall-clock time *in Pacific*, not in
// whatever timezone the client happens to be in. Using Date#getHours() etc. reads
// the local zone and produces a shifted instant on non-Pacific clients, which the
// backend then rejects as "Validation failed" (or silently books the wrong time).

const PACIFIC_TIME_ZONE = 'America/Los_Angeles';

const PACIFIC_PARTS = new Intl.DateTimeFormat('en-CA', {
  timeZone: PACIFIC_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23', // 00-23, so midnight is "00" not "24"
});

/**
 * Format an ISO instant as the backend-expected "YYYY-MM-DD HH:mm" string in
 * Pacific time, independent of the browser's local timezone.
 */
export function formatStartForBackend(isoInstant: string): string {
  const parts = PACIFIC_PARTS.formatToParts(new Date(isoInstant));
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')} ${part('hour')}:${part('minute')}`;
}
