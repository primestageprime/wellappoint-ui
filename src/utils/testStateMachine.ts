/**
 * Simple test runner for the booking state machine
 * This can be run in the browser console to verify the logic
 */

import { getBookingState, type BookingState } from './bookingStateMachine';

function runTests() {
  console.log('🧪 Running Booking State Machine Tests...\n');

  const mockSlot = {
    startTime: '2025-09-24T09:25:00Z',
    location: 'OFFICE'
  };

  // Test 1: Initial state - choose_services
  console.log('Test 1: Initial state - choose_services');
  const state1: BookingState = {
    selectedService: null,
    selectedDuration: null,
    selectedSlot: null,
    isLoadingSlots: false,
    isSubmitting: false,
    appointmentConfirmed: null
  };
  const result1 = getBookingState(state1);
  console.log('Expected: choose_services, Got:', result1.step);
  console.log('✅', result1.step === 'choose_services' ? 'PASS' : 'FAIL');
  console.log('');

  // Test 2: Duration selection
  console.log('Test 2: Duration selection');
  const state2: BookingState = {
    selectedService: 'SERVICE A',
    selectedDuration: null,
    selectedSlot: null,
    isLoadingSlots: false,
    isSubmitting: false,
    appointmentConfirmed: null
  };
  const result2 = getBookingState(state2);
  console.log('Expected: choose_duration, Got:', result2.step);
  console.log('✅', result2.step === 'choose_duration' ? 'PASS' : 'FAIL');
  console.log('');

  // Test 3: Loading slots
  console.log('Test 3: Loading slots');
  const state3: BookingState = {
    selectedService: 'SERVICE A',
    selectedDuration: 30,
    selectedSlot: null,
    isLoadingSlots: true,
    isSubmitting: false,
    appointmentConfirmed: null
  };
  const result3 = getBookingState(state3);
  console.log('Expected: loading_slots, Got:', result3.step);
  console.log('✅', result3.step === 'loading_slots' ? 'PASS' : 'FAIL');
  console.log('');

  // Test 4: Slot selection
  console.log('Test 4: Slot selection');
  const state4: BookingState = {
    selectedService: 'SERVICE A',
    selectedDuration: 30,
    selectedSlot: null,
    isLoadingSlots: false,
    isSubmitting: false,
    appointmentConfirmed: null
  };
  const result4 = getBookingState(state4);
  console.log('Expected: choose_slot, Got:', result4.step);
  console.log('✅', result4.step === 'choose_slot' ? 'PASS' : 'FAIL');
  console.log('');

  // Test 5: Confirmation state
  console.log('Test 5: Confirmation state');
  const state5: BookingState = {
    selectedService: 'SERVICE A',
    selectedDuration: 30,
    selectedSlot: mockSlot,
    isLoadingSlots: false,
    isSubmitting: false,
    appointmentConfirmed: null
  };
  const result5 = getBookingState(state5);
  console.log('Expected: confirmation, Got:', result5.step);
  console.log('✅', result5.step === 'confirmation' ? 'PASS' : 'FAIL');
  console.log('');

  // Test 6: Creating appointment
  console.log('Test 6: Creating appointment');
  const state6: BookingState = {
    selectedService: 'SERVICE A',
    selectedDuration: 30,
    selectedSlot: mockSlot,
    isLoadingSlots: false,
    isSubmitting: true,
    appointmentConfirmed: false
  };
  const result6 = getBookingState(state6);
  console.log('Expected: creating_appointment, Got:', result6.step);
  console.log('✅', result6.step === 'creating_appointment' ? 'PASS' : 'FAIL');
  console.log('');

  // Test 7: Appointment confirmed
  console.log('Test 7: Appointment confirmed');
  const state7: BookingState = {
    selectedService: 'SERVICE A',
    selectedDuration: 30,
    selectedSlot: mockSlot,
    isLoadingSlots: false,
    isSubmitting: false,
    appointmentConfirmed: true
  };
  const result7 = getBookingState(state7);
  console.log('Expected: appointment_confirmed, Got:', result7.step);
  console.log('✅', result7.step === 'appointment_confirmed' ? 'PASS' : 'FAIL');
  console.log('');

  console.log('🎉 All tests completed!');
}

// Make it available globally for testing
(window as any).runBookingStateMachineTests = runTests;

export { runTests };
