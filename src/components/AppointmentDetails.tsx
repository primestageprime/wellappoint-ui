import { 
  Card, 
  ServiceSummaryCard,
  AppointmentDetailsGrid,
  SessionDescription
} from './visual';
import { Calendar, Globe, Currency } from './visual/icons';
import { Clock } from 'lucide-solid';
import { formatFullDate, formatTime } from '../utils/dateUtils';
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

        <AppointmentDetailsGrid
          details={[
            {
              label: 'Date & Time',
              value: `${formatFullDate(props.selectedSlot.startTime)} at ${formatTime(props.selectedSlot.startTime)}`,
              icon: <Calendar class="w-5 h-5 text-primary" />
            },
            {
              label: 'Duration',
              value: `${props.service.duration} minutes`,
              icon: <Clock class="w-5 h-5 text-primary" />
            },
            {
              label: 'Location',
              value: props.selectedSlot.location,
              icon: <Globe class="w-5 h-5 text-primary" />
            },
            {
              label: 'Price',
              value: `$${props.service.price}`,
              icon: <Currency class="w-5 h-5 text-primary" />
            }
          ]}
        />

        <SessionDescription description={props.service?.durationDescription || ''} />
      </div>
    </Card>
  );
}
