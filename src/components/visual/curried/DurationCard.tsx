import { Show } from 'solid-js';
import { Card } from './Card';
import { H4 } from '../base/H4';
import { DurationsList } from '../../DurationsList';
import { type DurationCardProps } from '../../../types/visual';

export function DurationCard(props: DurationCardProps) {
  return (
    <Show when={props.bookingStep() === 'services' || props.bookingStep() === 'durations'}>
      <Card class={props.class}>
        <Show 
          when={props.selectedService()} 
          fallback={
            <>
              <H4>Select a Service</H4>
              <p class="text-muted-foreground text-sm mb-4">
                Choose from the available services to get started.
              </p>
            </>
          }
        >
          <H4>Select Duration</H4>
          <p class="text-muted-foreground text-sm mb-4">
            Choose your preferred duration for {props.selectedService()}.
          </p>
          <DurationsList 
            services={props.services()}
            selectedService={props.selectedService()!}
            onDurationSelect={props.onDurationSelect}
            onBack={props.onBack}
          />
        </Show>
      </Card>
    </Show>
  );
}
