import { createSignal, createEffect, createResource, For, Show } from 'solid-js';
import { useAuth } from '../auth/AuthProvider';
import { getAvailableSlots, type AvailableSlot } from '../services/availabilityService';
import { TimeItem, H3, H4, CenteredContent } from './visual';
import { formatDate, formatTime } from '../utils/dateUtils';
import { type AvailabilityListProps } from '../types/components';

export function AvailabilityList(props: AvailabilityListProps) {
  const auth = useAuth();
  const [selectedDate, setSelectedDate] = createSignal<string | null>(null);
  const [selectedTime, setSelectedTime] = createSignal<string | null>(null);

  console.log('AvailabilityList props:', {
    service: props.service,
    duration: props.duration,
    provider: props.provider,
    userEmail: auth.user()?.email
  });

  // Get available slots
  const userEmail = () => auth.user()?.email || '';
  const [availability] = createResource(
    () => ({ service: props.service, duration: props.duration, email: userEmail(), provider: props.provider }),
    ({ service, duration, email, provider }) => getAvailableSlots(service, duration, email, provider)
  );

  // Group slots by date and sort them chronologically
  const groupedSlots = () => {
    if (!availability()) return {};
    
    const groups: Record<string, AvailableSlot[]> = {};
    availability()!.forEach(slot => {
      const date = new Date(slot.startTime).toISOString().split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(slot);
    });
    
    // Sort slots within each day by start time
    Object.keys(groups).forEach(date => {
      groups[date].sort((a, b) => {
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      });
    });
    
    return groups;
  };

  const handleTimeSelect = (slot: AvailableSlot) => {
    props.onSlotSelect(slot);
  };

  const handleBackToDurations = () => {
    props.onBack();
  };



  return (
    <div class="space-y-4">
      <div class="flex items-center space-x-4">
        <button
          onClick={handleBackToDurations}
          class="text-primary hover:text-primary/80 text-sm font-medium"
        >
          ← Back to durations
        </button>
      </div>

      <CenteredContent>
        <H3>Select Appointment Time</H3>
        <H4>Choose your preferred date and time</H4>
      </CenteredContent>

      <Show when={availability.loading}>
        <div class="text-center py-8">
          <div class="text-primary">Loading available times...</div>
        </div>
      </Show>

      <Show when={availability.error}>
        <div class="text-center py-8">
          <div class="text-red-500">Error loading availability: {availability.error}</div>
        </div>
      </Show>

      <Show when={!availability.loading && !availability.error && availability()}>
        <Show when={Object.keys(groupedSlots()).length === 0} fallback={
          <div class="space-y-8 max-h-96 overflow-y-auto w-full">
            <For each={Object.entries(groupedSlots()).sort(([dateA], [dateB]) => dateA.localeCompare(dateB))}>
              {([date, slots]) => (
                <div class="space-y-4 w-full">
                  <div class="border-b border-primary/20 pb-2">
                    <H4 class="text-xl font-bold text-primary">{formatDate(date)}</H4>
                  </div>
                  <div class="flex flex-wrap gap-2 w-full" style="max-width: 100%;">
                    <For each={slots}>
                      {(slot) => (
                        <TimeItem
                          time={formatTime(slot.startTime)}
                          available={true}
                          onClick={() => handleTimeSelect(slot)}
                        />
                      )}
                    </For>
                  </div>
                </div>
              )}
            </For>
          </div>
        }>
          <div class="text-center py-8">
            <div class="text-primary">No appointments available</div>
          </div>
        </Show>
      </Show>
    </div>
  );
}
