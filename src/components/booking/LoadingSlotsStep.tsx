import { 
  ServiceSummaryCard,
  DurationSummaryCard,
  LoadingState,
} from '../visual';
import { getServiceIconWithFallback } from '../../utils/serviceIcons';

export interface LoadingSlotsStepProps {
  selectedServiceName: string;
  serviceDescription: string;
  selectedDuration: number;
  durationDescription: string;
  price: number;
}

/**
 * Loading state shown while fetching available time slots
 */
export function LoadingSlotsStep(props: LoadingSlotsStepProps) {
  return (
    <>
      <ServiceSummaryCard
        icon={getServiceIconWithFallback(props.selectedServiceName)}
        title={props.selectedServiceName}
        subtitle={props.serviceDescription}
      />
      
      <DurationSummaryCard
        duration={props.selectedDuration}
        price={props.price}
        description={props.durationDescription}
      />
      
      <LoadingState message="Finding available times..." />
    </>
  );
}

