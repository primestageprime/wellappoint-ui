import { For, Show } from 'solid-js';
import { CheckCircle } from 'lucide-solid';
import { 
  AppointmentsContainer,
  AppointmentItem,
  CenteredContent,
  ActionButtons,
  PrimaryButton,
} from '../visual';
import { type UserAppointmentsResponse } from '../../types/global';

export interface BookingSuccessStepProps {
  appointments: UserAppointmentsResponse | null | undefined;
  onBookAnother: () => void;
}

/**
 * Step 5: Booking Success
 * Shows success message and updated appointments list
 */
export function BookingSuccessStep(props: BookingSuccessStepProps) {
  return (
    <>
      {/* Show updated appointments list */}
      <Show when={props.appointments && typeof props.appointments === 'object' && 'appointments' in props.appointments}>
        <AppointmentsContainer 
          appointmentRequestCap={props.appointments!.appointmentRequestCap}
          appointmentCount={props.appointments!.appointments.length}
        >
          <For each={props.appointments!.appointments}>
            {(apt) => (
              <AppointmentItem
                service={apt.service}
                duration={apt.duration}
                date={apt.date}
                time={apt.time}
              />
            )}
          </For>
        </AppointmentsContainer>
      </Show>
      
      <CenteredContent>
        <div class="flex justify-center mb-4">
          <CheckCircle class="w-16 h-16 text-green-600" />
        </div>
        <p class="text-card-foreground font-semibold text-lg">Appointment Request Confirmed!</p>
        <p class="text-muted-foreground text-center max-w-md">
          Your appointment request has been submitted successfully. You'll receive a confirmation email shortly.
        </p>
      </CenteredContent>
      
      <div class="bg-green-50 border border-green-200 rounded-lg p-6">
        <h4 class="font-semibold text-green-900 mb-2">What happens next?</h4>
        <ul class="text-sm text-green-800 space-y-1">
          <li>• Check your email for confirmation details</li>
          <li>• Your provider will review and confirm your appointment</li>
          <li>• You'll receive a calendar invitation once confirmed</li>
        </ul>
      </div>
      
      <ActionButtons>
        <PrimaryButton onClick={props.onBookAnother}>
          Book Another Appointment
        </PrimaryButton>
      </ActionButtons>
    </>
  );
}

