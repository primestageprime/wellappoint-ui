import { H3, H4, CenteredContent } from './visual';
import { AppointmentDetails } from './AppointmentDetails';
import { type BookingService, type AvailableSlot } from '../types/global';

interface LoadingPanelProps {
  service: BookingService;
  selectedSlot: AvailableSlot;
}

export function LoadingPanel(props: LoadingPanelProps) {
  return (
    <div class="space-y-6">
      <CenteredContent>
        <H3>Confirm Your Healing Session</H3>
        <H4>Review your appointment details</H4>
      </CenteredContent>

      <AppointmentDetails 
        service={props.service}
        selectedSlot={props.selectedSlot}
      />

      <div class="p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
        <div class="text-blue-600 text-lg font-semibold mb-2">🔄 Creating Your Appointment...</div>
        <p class="text-blue-700">Please wait while we confirm your booking.</p>
      </div>
    </div>
  );
}
