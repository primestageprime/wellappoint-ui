import { createMemo, Accessor } from 'solid-js';
import { useCalendar } from '../stores/calendarStore';
import { type AvailableSlot } from '../types/global';

// Client-side slot calculation (simplified version - you may need to import actual logic)
// This would ideally use the same logic as the backend but run client-side
function calculateSlotsFromEvents(
  events: any[],
  service: string,
  duration: number
): AvailableSlot[] {
  // TODO: Implement actual slot calculation logic here
  // This is a placeholder that would need the real algorithm from the backend
  // For now, we'll still call the API but this structure allows for future client-side calculation
  
  console.log('🔄 Calculating slots from cached calendar events', { 
    eventCount: events.length, 
    service, 
    duration 
  });
  
  // Placeholder: return empty for now until we implement client-side logic
  return [];
}

/**
 * Hook that provides available time slots using cached calendar data
 * 
 * This hook uses the pre-fetched calendar data from CalendarProvider
 * and calculates available slots client-side when service and duration are provided.
 */
export function useAvailabilityWithCache(
  service: Accessor<string | null>,
  duration: Accessor<number | null>
) {
  const calendar = useCalendar();
  
  // Calculate slots from cached calendar data
  const availableSlots = createMemo(() => {
    const svc = service();
    const dur = duration();
    const calData = calendar.calendarData();
    
    if (!svc || !dur || !calData) {
      return [];
    }
    
    console.log('📊 Calculating slots with cached data');
    return calculateSlotsFromEvents(calData.events, svc, dur);
  });
  
  const isLoading = () => {
    // Loading if we have service+duration but calendar data is still loading
    return !!(service() && duration() && calendar.calendarData.loading);
  };
  
  return {
    slots: availableSlots,
    loading: isLoading,
    error: calendar.calendarData.error,
    lastFetchedAt: () => calendar.calendarData()?.fetchedAt,
  };
}

