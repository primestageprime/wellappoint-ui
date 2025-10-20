import { For } from 'solid-js';
import { TimeSlotListContainer, DaySlotGroup, TimeItem } from './visual';

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
    <TimeSlotListContainer>
      <For each={props.slots}>
        {(daySlots) => (
          <DaySlotGroup date={daySlots.date}>
            <For each={daySlots.times}>
              {(slot) => (
                <TimeItem
                  time={slot.time}
                  available={slot.available}
                  onClick={() => props.onSlotSelect(slot.time)}
                />
              )}
            </For>
          </DaySlotGroup>
        )}
      </For>
    </TimeSlotListContainer>
  );
}

