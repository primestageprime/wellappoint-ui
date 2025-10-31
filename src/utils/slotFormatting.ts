import { type AvailableSlot } from '../types/global';

export interface GroupedSlot {
  date: string;
  times: {
    time: string;
    available: boolean;
    slot: AvailableSlot;
  }[];
}

/**
 * Formats a slot's start time as a full date and time string
 * Example: "Monday, January 15, 2024 at 2:30 PM"
 */
export function formatSlotTime(slot: AvailableSlot): string {
  const date = new Date(slot.startTime);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) + ' at ' + date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
}

/**
 * Groups available time slots by date
 * Returns an array of dates with their corresponding time slots
 */
export function groupSlotsByDate(slots: AvailableSlot[]): GroupedSlot[] {
  if (!slots || slots.length === 0) return [];
  
  const grouped = new Map<string, AvailableSlot[]>();
  
  slots.forEach(slot => {
    const date = new Date(slot.startTime);
    const dateKey = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(slot);
  });
  
  return Array.from(grouped.entries()).map(([date, times]) => ({
    date,
    times: times.map(slot => ({
      time: new Date(slot.startTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      }),
      available: true,
      slot
    }))
  }));
}

