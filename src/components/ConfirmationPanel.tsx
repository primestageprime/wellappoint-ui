import { H3, H4, CenteredContent, ActionButtons } from './visual';
import { AppointmentDetails } from './AppointmentDetails';
import { type ConfirmationPanelProps } from '../types/components';

export function ConfirmationPanel(props: ConfirmationPanelProps) {
  // Safety check - if service is undefined, show error
  if (!props.service) {
    return (
      <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-600">Error: Service data not found. Please go back and select a service again.</p>
        <button 
          onClick={props.onBack}
          class="mt-2 text-sm text-red-600 hover:text-red-800"
        >
          ← Go Back
        </button>
      </div>
    );
  }

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

      <ActionButtons />
    </div>
  );
}
