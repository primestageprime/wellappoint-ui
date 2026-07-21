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
  ProgressButton,
} from '../visual';
import { Show } from 'solid-js';
import { type AvailableSlot } from '../../types/global';
import { formatSlotTime } from '../../utils/slotFormatting';
import { resolveBookingLocation } from '../../utils/bookingLocation';

export interface BookingConfirmationStepProps {
  serviceName: string;
  serviceDescription: string;
  duration: number;
  slot: AvailableSlot;
  /** Provider's configured address; the slot itself only carries a modality enum. */
  providerLocation?: string;
  price: number;
  isSubmitting: boolean;
  isSuccess?: boolean;
  progress?: number;
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
        <Show
          when={resolveBookingLocation({
            rawLocation: props.slot?.location,
            providerLocation: props.providerLocation,
          })}
        >
          {(location) => <LocationDetailItem value={location()} />}
        </Show>
        <PriceDetailItem value={`$${props.price}`} />
      </AppointmentDetailsGrid>
      
      <ActionButtons>
        <SecondaryButton onClick={props.onBack} disabled={props.isSubmitting || props.isSuccess}>Back</SecondaryButton>
        <ProgressButton
          text="Confirm Your Session"
          loadingText="Booking..."
          successText="Appointment Booked!"
          isLoading={props.isSubmitting}
          isSuccess={props.isSuccess || false}
          taskId="booking-appointment"
          type="button"
          onClick={props.onConfirm}
          fixedProgress={props.progress}
        />
      </ActionButtons>
    </BookingConfirmationContainer>
  );
}

