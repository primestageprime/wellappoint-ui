/**
 * Booking State Machine
 * 
 * This function determines the current state of the booking flow based on the current data.
 * It's a pure function that takes all the relevant state and returns the current step.
 */

export type BookingStep = 
  | 'choose_services'        // Show service selection
  | 'choose_duration'        // Show duration selection  
  | 'loading_slots'          // Loading available time slots
  | 'choose_slot'            // Show time slot selection
  | 'confirmation'           // Show confirmation panel
  | 'creating_appointment'   // Creating appointment (user clicked confirm, waiting for response)
  | 'appointment_confirmed'; // Appointment created successfully

export interface BookingState {
  selectedService: string | null;
  selectedDuration: number | null;
  selectedSlot: any | null;
  isLoadingSlots: boolean;
  isSubmitting: boolean;
  appointmentConfirmed: boolean | null;
}

export interface BookingStateMachineResult {
  step: BookingStep;
  showServices: boolean;
  showDurations: boolean;
  showLoadingSlots: boolean;
  showSlotSelection: boolean;
  showConfirmation: boolean;
  showCreatingAppointment: boolean;
  showAppointmentConfirmed: boolean;
}

/**
 * Pure function that determines the current booking state
 */
export function getBookingState(state: BookingState): BookingStateMachineResult {
  const {
    selectedService,
    selectedDuration,
    selectedSlot,
    isLoadingSlots,
    isSubmitting,
    appointmentConfirmed
  } = state;

  // Determine the current step
  let step: BookingStep;
  
  if (!selectedService) {
    step = 'choose_services';
  } else if (!selectedDuration) {
    step = 'choose_duration';
  } else if (isLoadingSlots) {
    step = 'loading_slots';
  } else if (!selectedSlot) {
    step = 'choose_slot';
  } else if (selectedSlot && appointmentConfirmed === null) {
    step = 'confirmation';
  } else if (isSubmitting) {
    step = 'creating_appointment';
  } else {
    step = 'appointment_confirmed';
  }

  // Return which components should be visible
  return {
    step,
    showServices: step === 'choose_services',
    showDurations: step === 'choose_duration',
    showLoadingSlots: step === 'loading_slots',
    showSlotSelection: step === 'choose_slot',
    showConfirmation: step === 'confirmation',
    showCreatingAppointment: step === 'creating_appointment',
    showAppointmentConfirmed: step === 'appointment_confirmed'
  };
}
