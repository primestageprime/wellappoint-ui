/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Format a date string to a readable date format
 * @param dateStr - Date string in ISO format (e.g., "2025-08-28")
 * @returns Formatted date string (e.g., "Thursday, August 28")
 */
export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day); // month is 0-indexed
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
}

/**
 * Format a datetime string to a full date format with year
 * @param dateTimeStr - DateTime string in ISO format
 * @param timeZone - Timezone to use (default: 'America/Los_Angeles')
 * @returns Formatted full date string (e.g., "Thursday, August 28, 2025")
 */
export function formatFullDate(dateTimeStr: string, timeZone: string = 'America/Los_Angeles'): string {
  return new Date(dateTimeStr).toLocaleDateString('en-US', {
    timeZone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format a Date object to ISO date string (YYYY-MM-DD)
 * @param date - Date object
 * @returns ISO date string (e.g., "2025-08-28")
 */
export function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Format a datetime string to a readable time format
 * @param dateTimeStr - DateTime string in ISO format
 * @param timeZone - Timezone to use (default: 'America/Los_Angeles')
 * @returns Formatted time string (e.g., "1:45 PM")
 */
export function formatTime(dateTimeStr: string, timeZone: string = 'America/Los_Angeles'): string {
  return new Date(dateTimeStr).toLocaleString('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Format a datetime string to a full datetime format
 * @param dateTimeStr - DateTime string in ISO format
 * @param timeZone - Timezone to use (default: 'America/Los_Angeles')
 * @returns Formatted datetime string (e.g., "8/28/2025, 1:45 PM")
 */
export function formatDateTime(dateTimeStr: string, timeZone: string = 'America/Los_Angeles'): string {
  return new Date(dateTimeStr).toLocaleString('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Format a datetime string to a short date format
 * @param dateTimeStr - DateTime string in ISO format
 * @param timeZone - Timezone to use (default: 'America/Los_Angeles')
 * @returns Formatted short date string (e.g., "8/28/2025")
 */
export function formatShortDate(dateTimeStr: string, timeZone: string = 'America/Los_Angeles'): string {
  return new Date(dateTimeStr).toLocaleDateString('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });
}

/**
 * Format a datetime string to a time range
 * @param startTime - Start time in ISO format
 * @param endTime - End time in ISO format
 * @param timeZone - Timezone to use (default: 'America/Los_Angeles')
 * @returns Formatted time range string (e.g., "1:45 PM - 2:15 PM")
 */
export function formatTimeRange(startTime: string, endTime: string, timeZone: string = 'America/Los_Angeles'): string {
  const start = formatTime(startTime, timeZone);
  const end = formatTime(endTime, timeZone);
  return `${start} - ${end}`;
}
