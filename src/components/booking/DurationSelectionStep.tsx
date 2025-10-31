import { For } from 'solid-js';
import { 
  ServiceSummaryCard,
  DurationListContainer,
  DurationItem,
} from '../visual';
import { type BookingService } from '../../types/service';
import { getServiceIconWithFallback } from '../../utils/serviceIcons';

export interface DurationSelectionStepProps {
  selectedServiceName: string;
  serviceDescription: string;
  durations: BookingService[];
  onSelectDuration: (duration: number) => void;
  onEditService: () => void;
}

/**
 * Step 2: Duration Selection
 * Shows the selected service and available duration options
 */
export function DurationSelectionStep(props: DurationSelectionStepProps) {
  return (
    <>
      <ServiceSummaryCard
        icon={getServiceIconWithFallback(props.selectedServiceName)}
        title={props.selectedServiceName}
        subtitle={props.serviceDescription}
        onEdit={props.onEditService}
      />
      
      <DurationListContainer title="Available Durations">
        <For each={props.durations}>
          {(service) => (
            <DurationItem
              duration={`${service.duration} minutes`}
              description={service.durationDescription ?? service.description ?? ''}
              price={`$${service.price}`}
              onClick={() => props.onSelectDuration(service.duration)}
            />
          )}
        </For>
      </DurationListContainer>
    </>
  );
}

