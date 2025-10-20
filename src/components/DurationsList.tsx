import { For } from 'solid-js';
import { DurationListContainer, DurationItem } from './visual';
import { type DurationsListProps } from '../types/components';

export function DurationsList(props: DurationsListProps) {
  // Filter services for the selected service
  const serviceDurations = () => {
    return props.services
      .filter(service => service.name === props.selectedService);
  };

  return (
    <div class="space-y-4">
      <DurationListContainer title="Available Durations">
        <For each={serviceDurations()}>
          {(service) => (
            <DurationItem
              duration={`${service.duration} minutes`}
              description={service.durationDescription || service.description || 'Professional wellness service'}
              price={`$${service.price}`}
              onClick={() => props.onDurationSelect(service.duration)}
            />
          )}
        </For>
      </DurationListContainer>
    </div>
  );
}
