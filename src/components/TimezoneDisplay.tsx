import { Clock } from 'lucide-solid';
import { getUserTimezone, getTimezoneAbbreviation } from '../utils/timezone';

interface TimezoneDisplayProps {
  class?: string;
}

/**
 * Displays the user's current timezone
 * Helps users understand what timezone they're viewing appointment times in
 */
export function TimezoneDisplay(props: TimezoneDisplayProps) {
  const timezone = getUserTimezone();
  const abbreviation = getTimezoneAbbreviation();

  return (
    <div class={`flex items-center gap-2 text-sm text-gray-600 ${props.class || ''}`}>
      <Clock class="w-4 h-4" />
      <span>Times shown in your timezone: <strong>{abbreviation}</strong></span>
    </div>
  );
}
