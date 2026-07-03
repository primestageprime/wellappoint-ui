import { 
  Card, 
  ServiceSummaryCard,
  AppointmentDetailsGrid,
  SessionDescription
} from './visual';
import { type BookingService, type AvailableSlot } from '../types/global';

const serviceIcons = {
  'Massage': '❤️',
  'Cranial Sacral Massage': '🧠',
  'Reflexology': '🦶'
};

interface AppointmentDetailsProps {
  service: BookingService;
  selectedSlot: AvailableSlot;
}

export function AppointmentDetails(props: AppointmentDetailsProps) {
  const ServiceIcon = serviceIcons[props.service.name as keyof typeof serviceIcons] || '❤️';

  return (
    <Card class="p-6 space-y-6">
      <div class="space-y-4">
        <ServiceSummaryCard
          icon={<span class="text-2xl">{ServiceIcon}</span>}
          title={props.service.name}
          subtitle={props.service.description || ''}
        />

        <AppointmentDetailsGrid />

        <SessionDescription description={props.service?.durationDescription || ''} />
      </div>
    </Card>
  );
}
