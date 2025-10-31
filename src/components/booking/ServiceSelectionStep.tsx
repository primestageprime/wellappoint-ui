import { For, Show } from 'solid-js';
import { 
  ServicesContainer,
  ServiceItem,
} from '../visual';
import { type BookingService } from '../../types/service';
import { getServiceIconWithFallback } from '../../utils/serviceIcons';

export interface ServiceSelectionStepProps {
  services: BookingService[];
  appointmentCount: number;
  appointmentRequestCap: number;
  onSelectService: (serviceName: string) => void;
}

/**
 * Step 1: Service Selection
 * Displays a list of available services for the user to choose from
 * Shows a message if user has reached their appointment limit
 */
export function ServiceSelectionStep(props: ServiceSelectionStepProps) {
  const hasReachedLimit = () => props.appointmentCount >= props.appointmentRequestCap;

  return (
    <ServicesContainer title="Available Services">
      <Show 
        when={!hasReachedLimit()}
        fallback={
          <div class="text-center py-8 px-4">
            <p class="text-lg font-semibold text-card-foreground mb-2">
              You have reached your appointment limit
            </p>
            <p class="text-sm text-muted-foreground">
              You currently have {props.appointmentCount} appointment{props.appointmentCount !== 1 ? 's' : ''} 
              {' '}(limit: {props.appointmentRequestCap}). 
              Please wait for your existing appointments to be completed before booking more or contact the provider to increase your limit.
            </p>
          </div>
        }
      >
        <For each={props.services}>
          {(service) => {
            const desc = service.description || '';
            return (
              <ServiceItem
                name={service.name}
                description={desc}
                icon={getServiceIconWithFallback(service.name)}
                onClick={() => props.onSelectService(service.name)}
              />
            );
          }}
        </For>
      </Show>
    </ServicesContainer>
  );
}

