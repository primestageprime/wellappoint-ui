import { Show } from 'solid-js';
import { 
  BookingConfirmationContainer,
  AppointmentDetailsGrid,
  ServiceDetailItem,
  DescriptionDetailItem,
  TimeSlotDetailItem,
  DurationDetailItem,
  LocationDetailItem,
  PriceDetailItem,
  ActionButtons,
  SecondaryButton,
  PrimaryButton,
  LoadingState,
} from '../visual';
import { type AvailableSlot } from '../../types/global';
import { formatSlotTime } from '../../utils/slotFormatting';

export interface BookingConfirmationStepProps {
  serviceName: string;
  serviceDescription: string;
  duration: number;
  slot: AvailableSlot;
  price: number;
  isSubmitting: boolean;
  onConfirm: () => void;
  onBack: () => void;
}

/**
 * Step 4: Booking Confirmation
 * Shows appointment details for review and confirmation
 * Also handles the processing/submitting state
 */
export function BookingConfirmationStep(props: BookingConfirmationStepProps) {
  return (
    <BookingConfirmationContainer 
      title={props.isSubmitting ? "Processing Your Appointment" : "Confirm Your Appointment"}
    >
      <AppointmentDetailsGrid>
        <ServiceDetailItem value={props.serviceName} />
        <DescriptionDetailItem value={props.serviceDescription} />
        <TimeSlotDetailItem value={formatSlotTime(props.slot)} />
        <DurationDetailItem value={`${props.duration} minutes`} />
        <LocationDetailItem value={props.slot?.location || 'Location TBD'} />
        <PriceDetailItem value={`$${props.price}`} />
      </AppointmentDetailsGrid>
      
      <Show
        when={!props.isSubmitting}
        fallback={<LoadingState message="Submitting your appointment request..." taskId="booking-appointment" />}
      >
        <ActionButtons>
          <SecondaryButton onClick={props.onBack}>Back</SecondaryButton>
          <PrimaryButton onClick={props.onConfirm}>Confirm Your Session</PrimaryButton>
        </ActionButtons>
      </Show>
    </BookingConfirmationContainer>
  );
}

