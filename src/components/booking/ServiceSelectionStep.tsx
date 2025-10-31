import { For } from 'solid-js';
import { 
  ServicesContainer,
  ServiceItem,
} from '../visual';
import { type BookingService } from '../../types/service';
import { getServiceIconWithFallback } from '../../utils/serviceIcons';

export interface ServiceSelectionStepProps {
  services: BookingService[];
  onSelectService: (serviceName: string) => void;
}

/**
 * Step 1: Service Selection
 * Displays a list of available services for the user to choose from
 */
export function ServiceSelectionStep(props: ServiceSelectionStepProps) {
  return (
    <ServicesContainer title="Available Services">
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
    </ServicesContainer>
  );
}

