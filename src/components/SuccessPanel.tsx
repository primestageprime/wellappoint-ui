import { H3, H4, CenteredContent } from './visual';
import { AppointmentDetails } from './AppointmentDetails';
import { type BookingService, type AvailableSlot } from '../types/global';

interface SuccessPanelProps {
  service: BookingService;
  selectedSlot: AvailableSlot;
  onBookAnother: () => void;
}

export function SuccessPanel(props: SuccessPanelProps) {
  return (
    <div class="space-y-6">
      <div class="flex items-center space-x-4">
        <button
          onClick={props.onBookAnother}
          class="text-primary hover:text-primary/80 text-sm font-medium"
        >
          ← Book Another Session
        </button>
      </div>
      
      <CenteredContent>
        <H3>✨ Your Healing Session is Confirmed!</H3>
        <H4>Your appointment has been scheduled successfully</H4>
      </CenteredContent>

      <div class="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
        <div class="text-green-600 text-lg font-semibold mb-2">✅ Appointment Created Successfully!</div>
        <p class="text-green-700 mb-4">Your appointment has been confirmed and added to your calendar.</p>
      </div>

      <AppointmentDetails 
        service={props.service}
        selectedSlot={props.selectedSlot}
      />

      <div class="text-center">
        <button 
          onClick={props.onBookAnother}
          class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Book Another Appointment
        </button>
      </div>
    </div>
  );
}
