/**
 * Debug utility for testing the state machine in the browser
 */

import { getBookingState, type BookingState } from './bookingStateMachine';

export function debugBookingFlow() {
  console.log('🔍 Booking State Machine Debug Tool');
  console.log('=====================================');
  
  const mockSlot = {
    startTime: '2025-09-24T09:25:00Z',
    location: 'OFFICE'
  };

  // Test the complete flow
  const scenarios = [
    {
      name: '1. Initial State',
      state: {
        selectedService: null,
        selectedDuration: null,
        selectedSlot: null,
        isLoadingSlots: false,
        isSubmitting: false,
        appointmentConfirmed: null
      } as BookingState
    },
    {
      name: '2. Service Selected',
      state: {
        selectedService: 'SERVICE A',
        selectedDuration: null,
        selectedSlot: null,
        isLoadingSlots: false,
        isSubmitting: false,
        appointmentConfirmed: null
      } as BookingState
    },
    {
      name: '3. Duration Selected',
      state: {
        selectedService: 'SERVICE A',
        selectedDuration: 30,
        selectedSlot: null,
        isLoadingSlots: false,
        isSubmitting: false,
        appointmentConfirmed: null
      } as BookingState
    },
    {
      name: '4. Loading Slots',
      state: {
        selectedService: 'SERVICE A',
        selectedDuration: 30,
        selectedSlot: null,
        isLoadingSlots: true,
        isSubmitting: false,
        appointmentConfirmed: null
      } as BookingState
    },
    {
      name: '5. Time Slot Selected',
      state: {
        selectedService: 'SERVICE A',
        selectedDuration: 30,
        selectedSlot: mockSlot,
        isLoadingSlots: false,
        isSubmitting: false,
        appointmentConfirmed: null
      } as BookingState
    },
    {
      name: '6. User Clicked Confirm (Loading)',
      state: {
        selectedService: 'SERVICE A',
        selectedDuration: 30,
        selectedSlot: mockSlot,
        isLoadingSlots: false,
        isSubmitting: true,
        appointmentConfirmed: false
      } as BookingState
    },
    {
      name: '7. Appointment Created Successfully',
      state: {
        selectedService: 'SERVICE A',
        selectedDuration: 30,
        selectedSlot: mockSlot,
        isLoadingSlots: false,
        isSubmitting: false,
        appointmentConfirmed: true
      } as BookingState
    }
  ];

  scenarios.forEach(scenario => {
    const result = getBookingState(scenario.state);
    console.log(`\n${scenario.name}:`);
    console.log(`  Step: ${result.step}`);
    console.log(`  Show Services: ${result.showServices}`);
    console.log(`  Show Durations: ${result.showDurations}`);
    console.log(`  Show Loading Slots: ${result.showLoadingSlots}`);
    console.log(`  Show Slot Selection: ${result.showSlotSelection}`);
    console.log(`  Show Confirmation: ${result.showConfirmation}`);
    console.log(`  Show Creating Appointment: ${result.showCreatingAppointment}`);
    console.log(`  Show Appointment Confirmed: ${result.showAppointmentConfirmed}`);
  });

  console.log('\n✅ State machine test completed!');
  console.log('Expected flow: choose_services → choose_duration → loading_slots → choose_slot → confirmation → creating_appointment → appointment_confirmed');
}

// Make it available globally
(window as any).debugBookingFlow = debugBookingFlow;
