import { createContext, useContext, JSX, createMemo } from 'solid-js';
import { createStore } from 'solid-js/store';
import { getBookingState, type BookingState, type BookingStateMachineResult } from '../utils/bookingStateMachine';

interface BookingActions {
  selectService: (serviceName: string) => void;
  unselectService: () => void;
  selectDuration: (duration: number) => void;
  unselectDuration: () => void;
  selectSlot: (slot: any) => void;
  goBackToSlots: () => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setConfirmed: (confirmed: boolean) => void;
  reset: () => void;
}

interface BookingContextValue {
  state: BookingState;
  actions: BookingActions;
  currentStep: () => BookingStateMachineResult;
}

const BookingContext = createContext<BookingContextValue>();

export function BookingProvider(props: { children: JSX.Element }) {
  const [state, setState] = createStore<BookingState>({
    selectedService: null,
    selectedDuration: null,
    selectedSlot: null,
    isLoadingSlots: false,
    isSubmitting: false,
    appointmentConfirmed: null,
  });

  // Derived state using the state machine - use createMemo for proper reactivity
  const stepMemo = createMemo(() => {
    const result = getBookingState(state);
    console.log('🔄 State machine updated:', result.step, state);
    return result;
  });
  
  const currentStep = () => stepMemo();

  const actions: BookingActions = {
    selectService: (serviceName: string) => {
      console.log('📦 BookingStore: selectService', serviceName);
      setState({
        selectedService: serviceName,
        selectedDuration: null,
        selectedSlot: null,
        appointmentConfirmed: null,
      });
    },

    unselectService: () => {
      console.log('📦 BookingStore: unselectService');
      setState({
        selectedService: null,
        selectedDuration: null,
        selectedSlot: null,
        appointmentConfirmed: null,
      });
    },

    selectDuration: (duration: number) => {
      console.log('📦 BookingStore: selectDuration', duration);
      setState('selectedDuration', duration);
      setState('selectedSlot', null);
      setState('isLoadingSlots', true);
      
      // Reset loading after slot calculation (happens in useAvailability)
      setTimeout(() => setState('isLoadingSlots', false), 100);
    },

    unselectDuration: () => {
      console.log('📦 BookingStore: unselectDuration');
      setState({
        selectedDuration: null,
        selectedSlot: null,
      });
    },

    selectSlot: (slot: any) => {
      console.log('📦 BookingStore: selectSlot', slot);
      setState('selectedSlot', slot);
    },

    goBackToSlots: () => {
      console.log('📦 BookingStore: goBackToSlots');
      setState('selectedSlot', null);
    },

    setSubmitting: (isSubmitting: boolean) => {
      console.log('📦 BookingStore: setSubmitting', isSubmitting);
      setState('isSubmitting', isSubmitting);
    },

    setConfirmed: (confirmed: boolean) => {
      console.log('📦 BookingStore: setConfirmed', confirmed);
      setState('appointmentConfirmed', confirmed);
    },

    reset: () => {
      console.log('📦 BookingStore: reset');
      setState({
        selectedService: null,
        selectedDuration: null,
        selectedSlot: null,
        isLoadingSlots: false,
        isSubmitting: false,
        appointmentConfirmed: null,
      });
    },
  };

  const value: BookingContextValue = {
    state,
    actions,
    currentStep,
  };

  return (
    <BookingContext.Provider value={value}>
      {props.children}
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingContextValue {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

