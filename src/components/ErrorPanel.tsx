import { H3, H4, CenteredContent, ActionButtons } from './visual';
import { AppointmentDetails } from './AppointmentDetails';
import { type BookingService, type AvailableSlot } from '../types/global';

interface ErrorPanelProps {
  service: BookingService;
  selectedSlot: AvailableSlot;
  error: string;
  onBack: () => void;
  onRetry: () => void;
}

export function ErrorPanel(props: ErrorPanelProps) {
  return (
    <div class="space-y-6">
      <div class="flex items-center space-x-4">
        <button
          onClick={props.onBack}
          class="text-primary hover:text-primary/80 text-sm font-medium"
        >
          ← Back to time selection
        </button>
      </div>

      <CenteredContent>
        <H3>Confirm Your Healing Session</H3>
        <H4>Review your appointment details</H4>
      </CenteredContent>

      <AppointmentDetails 
        service={props.service}
        selectedSlot={props.selectedSlot}
      />

      <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-600">{props.error}</p>
      </div>

      <ActionButtons
        buttons={[
          {
            text: 'Try Again',
            onClick: props.onRetry,
            variant: 'primary',
            disabled: false
          }
        ]}
      />
    </div>
  );
}
