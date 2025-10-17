import { For } from 'solid-js';
import { TimeItem, H4 } from './visual';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface DaySlots {
  date: string;
  times: TimeSlot[];
}

interface TimeSlotListProps {
  slots: DaySlots[];
  onSlotSelect: (time: string) => void;
}

export function TimeSlotList(props: TimeSlotListProps) {
  return (
    <div class="space-y-8 max-h-96 overflow-y-auto w-full">
      <For each={props.slots}>
        {(daySlots) => (
          <div class="space-y-4 w-full">
            <div class="border-b border-primary/20 pb-2">
              <H4 class="text-xl font-bold text-primary">{daySlots.date}</H4>
            </div>
            <div class="flex flex-wrap gap-2 w-full">
              <For each={daySlots.times}>
                {(slot) => (
                  <TimeItem
                    time={slot.time}
                    available={slot.available}
                    onClick={() => props.onSlotSelect(slot.time)}
                  />
                )}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}

