import { describe, it, expect } from 'vitest';
import { getBookingState, type BookingState } from '../bookingStateMachine';

describe('getBookingState', () => {
  const createBaseState = (): BookingState => ({
    selectedService: null,
    selectedDuration: null,
    selectedSlot: null,
    isLoadingSlots: false,
    isSubmitting: false,
    appointmentConfirmed: null,
  });

  describe('choose_services state', () => {
    it('should return choose_services when no service is selected', () => {
      const state = createBaseState();
      const result = getBookingState(state);

      expect(result.step).toBe('choose_services');
      expect(result.showServices).toBe(true);
      expect(result.showDurations).toBe(false);
      expect(result.showLoadingSlots).toBe(false);
      expect(result.showSlotSelection).toBe(false);
      expect(result.showConfirmation).toBe(false);
      expect(result.showCreatingAppointment).toBe(false);
      expect(result.showAppointmentConfirmed).toBe(false);
    });
  });

  describe('choose_duration state', () => {
    it('should return choose_duration when service is selected but no duration', () => {
      const state = createBaseState();
      state.selectedService = 'massage-therapy';

      const result = getBookingState(state);

      expect(result.step).toBe('choose_duration');
      expect(result.showServices).toBe(false);
      expect(result.showDurations).toBe(true);
      expect(result.showLoadingSlots).toBe(false);
      expect(result.showSlotSelection).toBe(false);
      expect(result.showConfirmation).toBe(false);
      expect(result.showCreatingAppointment).toBe(false);
      expect(result.showAppointmentConfirmed).toBe(false);
    });
  });

  describe('loading_slots state', () => {
    it('should return loading_slots when service and duration are selected but loading slots', () => {
      const state = createBaseState();
      state.selectedService = 'massage-therapy';
      state.selectedDuration = 60;
      state.isLoadingSlots = true;

      const result = getBookingState(state);

      expect(result.step).toBe('loading_slots');
      expect(result.showServices).toBe(false);
      expect(result.showDurations).toBe(false);
      expect(result.showLoadingSlots).toBe(true);
      expect(result.showSlotSelection).toBe(false);
      expect(result.showConfirmation).toBe(false);
      expect(result.showCreatingAppointment).toBe(false);
      expect(result.showAppointmentConfirmed).toBe(false);
    });
  });

  describe('choose_slot state', () => {
    it('should return choose_slot when service and duration are selected but no slot', () => {
      const state = createBaseState();
      state.selectedService = 'massage-therapy';
      state.selectedDuration = 60;
      state.isLoadingSlots = false;

      const result = getBookingState(state);

      expect(result.step).toBe('choose_slot');
      expect(result.showServices).toBe(false);
      expect(result.showDurations).toBe(false);
      expect(result.showLoadingSlots).toBe(false);
      expect(result.showSlotSelection).toBe(true);
      expect(result.showConfirmation).toBe(false);
      expect(result.showCreatingAppointment).toBe(false);
      expect(result.showAppointmentConfirmed).toBe(false);
    });
  });

  describe('confirmation state', () => {
    it('should return confirmation when slot is selected and appointmentConfirmed is null', () => {
      const state = createBaseState();
      state.selectedService = 'massage-therapy';
      state.selectedDuration = 60;
      state.selectedSlot = { date: '2024-01-15', time: '10:00' };
      state.isSubmitting = false;
      state.appointmentConfirmed = null;

      const result = getBookingState(state);

      expect(result.step).toBe('confirmation');
      expect(result.showServices).toBe(false);
      expect(result.showDurations).toBe(false);
      expect(result.showLoadingSlots).toBe(false);
      expect(result.showSlotSelection).toBe(false);
      expect(result.showConfirmation).toBe(true);
      expect(result.showCreatingAppointment).toBe(false);
      expect(result.showAppointmentConfirmed).toBe(false);
    });
  });

  describe('creating_appointment state', () => {
    it('should return creating_appointment when submitting', () => {
      const state = createBaseState();
      state.selectedService = 'massage-therapy';
      state.selectedDuration = 60;
      state.selectedSlot = { date: '2024-01-15', time: '10:00' };
      state.isSubmitting = true;
      state.appointmentConfirmed = false; // Not null, so not confirmation state

      const result = getBookingState(state);

      expect(result.step).toBe('creating_appointment');
      expect(result.showServices).toBe(false);
      expect(result.showDurations).toBe(false);
      expect(result.showLoadingSlots).toBe(false);
      expect(result.showSlotSelection).toBe(false);
      expect(result.showConfirmation).toBe(false);
      expect(result.showCreatingAppointment).toBe(true);
      expect(result.showAppointmentConfirmed).toBe(false);
    });
  });

  describe('appointment_confirmed state', () => {
    it('should return appointment_confirmed when appointment is confirmed (not submitting)', () => {
      const state = createBaseState();
      state.selectedService = 'massage-therapy';
      state.selectedDuration = 60;
      state.selectedSlot = { date: '2024-01-15', time: '10:00' };
      state.isSubmitting = false;
      state.appointmentConfirmed = true;

      const result = getBookingState(state);

      expect(result.step).toBe('appointment_confirmed');
      expect(result.showServices).toBe(false);
      expect(result.showDurations).toBe(false);
      expect(result.showLoadingSlots).toBe(false);
      expect(result.showSlotSelection).toBe(false);
      expect(result.showConfirmation).toBe(false);
      expect(result.showCreatingAppointment).toBe(false);
      expect(result.showAppointmentConfirmed).toBe(true);
    });

    it('should return appointment_confirmed when appointmentConfirmed is false (not submitting)', () => {
      const state = createBaseState();
      state.selectedService = 'massage-therapy';
      state.selectedDuration = 60;
      state.selectedSlot = { date: '2024-01-15', time: '10:00' };
      state.isSubmitting = false;
      state.appointmentConfirmed = false;

      const result = getBookingState(state);

      expect(result.step).toBe('appointment_confirmed');
      expect(result.showServices).toBe(false);
      expect(result.showDurations).toBe(false);
      expect(result.showLoadingSlots).toBe(false);
      expect(result.showSlotSelection).toBe(false);
      expect(result.showConfirmation).toBe(false);
      expect(result.showCreatingAppointment).toBe(false);
      expect(result.showAppointmentConfirmed).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should prioritize loading_slots over choose_slot when loading', () => {
      const state = createBaseState();
      state.selectedService = 'massage-therapy';
      state.selectedDuration = 60;
      state.isLoadingSlots = true;
      // Even if we have a slot, loading should take precedence
      state.selectedSlot = { date: '2024-01-15', time: '10:00' };

      const result = getBookingState(state);

      expect(result.step).toBe('loading_slots');
      expect(result.showLoadingSlots).toBe(true);
    });

    it('should prioritize creating_appointment over appointment_confirmed when submitting', () => {
      const state = createBaseState();
      state.selectedService = 'massage-therapy';
      state.selectedDuration = 60;
      state.selectedSlot = { date: '2024-01-15', time: '10:00' };
      state.isSubmitting = true;
      state.appointmentConfirmed = true;

      const result = getBookingState(state);

      expect(result.step).toBe('creating_appointment');
      expect(result.showCreatingAppointment).toBe(true);
    });

    it('should handle appointment_confirmed as false (goes to appointment_confirmed state)', () => {
      const state = createBaseState();
      state.selectedService = 'massage-therapy';
      state.selectedDuration = 60;
      state.selectedSlot = { date: '2024-01-15', time: '10:00' };
      state.isSubmitting = false;
      state.appointmentConfirmed = false;

      const result = getBookingState(state);

      expect(result.step).toBe('appointment_confirmed');
      expect(result.showAppointmentConfirmed).toBe(true);
    });
  });

  describe('state transitions', () => {
    it('should follow the correct state flow', () => {
      // Start with no selections
      let state = createBaseState();
      expect(getBookingState(state).step).toBe('choose_services');

      // Select service
      state.selectedService = 'massage-therapy';
      expect(getBookingState(state).step).toBe('choose_duration');

      // Select duration
      state.selectedDuration = 60;
      expect(getBookingState(state).step).toBe('choose_slot');

      // Start loading slots
      state.isLoadingSlots = true;
      expect(getBookingState(state).step).toBe('loading_slots');

      // Finish loading, select slot
      state.isLoadingSlots = false;
      state.selectedSlot = { date: '2024-01-15', time: '10:00' };
      state.appointmentConfirmed = null; // Initially null for confirmation
      expect(getBookingState(state).step).toBe('confirmation');

      // Start submitting (appointmentConfirmed becomes false, not null)
      state.isSubmitting = true;
      state.appointmentConfirmed = false;
      expect(getBookingState(state).step).toBe('creating_appointment');

      // Appointment confirmed (not submitting anymore)
      state.isSubmitting = false;
      state.appointmentConfirmed = true;
      expect(getBookingState(state).step).toBe('appointment_confirmed');
    });
  });
});