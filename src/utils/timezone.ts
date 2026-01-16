/**
 * Timezone Utility
 *
 * Detects and manages user timezone for date/time display.
 * Uses browser's built-in timezone detection - no permissions needed!
 */

/**
 * Get the user's local timezone from their browser
 * This uses the browser's system settings and doesn't require any permissions
 *
 * @returns IANA timezone identifier (e.g., "America/New_York", "Europe/London")
 */
export function getUserTimezone(): string {
  try {
    // Get timezone from browser's Intl API
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Validate that we got a real timezone
    if (timezone && timezone.length > 0) {
      return timezone;
    }
  } catch (error) {
    console.warn('Could not detect user timezone:', error);
  }

  // Fallback to UTC if detection fails
  return 'UTC';
}

/**
 * Get a human-readable timezone name
 *
 * @returns Timezone abbreviation (e.g., "PST", "EST", "GMT")
 */
export function getTimezoneAbbreviation(): string {
  try {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZoneName: 'short',
      timeZone: getUserTimezone()
    });

    const parts = formatter.formatToParts(date);
    const timeZonePart = parts.find(part => part.type === 'timeZoneName');

    if (timeZonePart) {
      return timeZonePart.value;
    }
  } catch (error) {
    console.warn('Could not get timezone abbreviation:', error);
  }

  return 'UTC';
}

/**
 * Get timezone offset in hours
 *
 * @returns Offset in hours (e.g., -5 for EST, -8 for PST)
 */
export function getTimezoneOffset(): number {
  const offsetMinutes = new Date().getTimezoneOffset();
  return -offsetMinutes / 60; // Negative because getTimezoneOffset returns negative for ahead of UTC
}

/**
 * Format timezone offset as string
 *
 * @returns Formatted offset (e.g., "UTC-5", "UTC+1")
 */
export function getTimezoneOffsetString(): string {
  const offset = getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '';
  return `UTC${sign}${offset}`;
}
