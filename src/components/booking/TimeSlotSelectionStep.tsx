import { For, Show } from 'solid-js';
import { 
  ServiceSummaryCard,
  DurationSummaryCard,
  TimeSlotListContainer,
  DaySlotGroup,
  TimeItem,
} from '../visual';
import { type AvailableSlot } from '../../types/global';
import { type GroupedSlot } from '../../utils/slotFormatting';
import { getServiceIconWithFallback } from '../../utils/serviceIcons';

export interface TimeSlotSelectionStepProps {
  selectedServiceName: string;
  serviceDescription: string;
  selectedDuration: number;
  durationDescription: string;
  price: number;
  groupedSlots: GroupedSlot[];
  onSelectSlot: (slot: AvailableSlot) => void;
  onEditService: () => void;
  onEditDuration: () => void;
}

/**
 * Step 3: Time Slot Selection
 * Shows selected service and duration, with available time slots grouped by date
 */
export function TimeSlotSelectionStep(props: TimeSlotSelectionStepProps) {
  return (
    <>
      <ServiceSummaryCard
        icon={getServiceIconWithFallback(props.selectedServiceName)}
        title={props.selectedServiceName}
        subtitle={props.serviceDescription}
        onEdit={props.onEditService}
      />
      
      <DurationSummaryCard
        duration={props.selectedDuration}
        price={props.price}
        description={props.durationDescription}
        onEdit={props.onEditDuration}
      />
      
      <Show when={props.groupedSlots.length > 0} fallback={
        <div class="text-center py-8 text-muted-foreground">
          No available time slots found. Please try a different service or duration.
        </div>
      }>
        <TimeSlotListContainer>
          <For each={props.groupedSlots}>
            {(daySlots) => (
              <DaySlotGroup date={daySlots.date}>
                <For each={daySlots.times}>
                  {(timeSlot) => (
                    <TimeItem
                      time={timeSlot.time}
                      available={timeSlot.available}
                      onClick={() => props.onSelectSlot(timeSlot.slot)}
                    />
                  )}
                </For>
              </DaySlotGroup>
            )}
          </For>
        </TimeSlotListContainer>
      </Show>
    </>
  );
}

