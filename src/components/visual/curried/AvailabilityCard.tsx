import { Show } from 'solid-js';
import { Card } from './Card';
import { H4 } from '../base/H4';
import { AvailabilityList } from '../../AvailabilityList';
import { type AvailabilityCardProps } from '../../../types/visual';

export function AvailabilityCard(props: AvailabilityCardProps) {
  return (
    <Show when={props.bookingStep() === 'availability'}>
      <Card class={props.class}>
        <H4>Select Time Slot</H4>
        <p class="text-muted-foreground text-sm mb-4">
          Choose an available time slot for your appointment.
        </p>
        <AvailabilityList 
          service={props.selectedService()!}
          duration={props.selectedDuration()!}
          onSlotSelect={props.onSlotSelect}
          onBack={props.onBack}
          provider={props.provider()}
        />
        <button 
          onClick={props.onBack}
          class="mt-4 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Duration
        </button>
      </Card>
    </Show>
  );
}
