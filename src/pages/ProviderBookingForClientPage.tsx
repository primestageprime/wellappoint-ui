import { Show, createSignal } from 'solid-js';
import { useAuth } from '../auth/AuthProvider';
import { A } from '@solidjs/router';
import {
  PageFrame,
  HeaderCard,
  Content,
  Split,
  Avatar,
  LogoutButton,
  Card,
} from '../components/visual';
import {
  ServiceSelectionStep,
  DurationSelectionStep,
  LoadingSlotsStep,
  TimeSlotSelectionStep,
  BookingConfirmationStep,
  BookingSuccessStep,
} from '../components/booking';
import { useBookingFlow } from '../hooks/useBookingFlow';

export function ProviderBookingForClientPage() {
  const auth = useAuth();

  // Client info state
  const [clientName, setClientName] = createSignal('');
  const [clientEmail, setClientEmail] = createSignal('');
  const [clientPhone, setClientPhone] = createSignal('');
  const [clientInfoSubmitted, setClientInfoSubmitted] = createSignal(false);

  const flow = useBookingFlow({
    email: clientEmail,
    buildRequest: (baseRequest) => ({
      ...baseRequest,
      userProfile: {
        name: clientName(),
        ...(clientPhone().trim() ? { phone: clientPhone().trim() } : {}),
      },
    }),
  });

  const {
    providerUsername, providerNotFound, booking, step,
    uniqueServices, serviceDurations, selectedServiceData,
    availableSlots, groupedSlots, isBookingSuccess, bookingProgress,
    bookingError, handleConfirm,
  } = flow;

  const isClientInfoValid = () =>
    clientName().trim().length > 0 && clientEmail().trim().length > 0;

  const handleClientInfoSubmit = (e: Event) => {
    e.preventDefault();
    if (isClientInfoValid()) {
      setClientInfoSubmitted(true);
    }
  };

  const handleBookAnother = () => {
    booking.actions.reset();
    setClientInfoSubmitted(false);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
  };

  return (
    <PageFrame>
      <HeaderCard>
        <Split
          left={<Avatar username={() => auth.user()?.nickname || auth.user()?.email?.split('@')[0] || ''} />}
          right={
            <div class="flex items-center gap-2">
              <A
                href={`/admin/${providerUsername()}`}
                class="text-primary hover:text-primary/80 px-2"
              >
                Back to Admin
              </A>
              <LogoutButton onLogout={() => auth.logout()}>Logout</LogoutButton>
            </div>
          }
        />
      </HeaderCard>

      <Content>
        {/* Provider not found */}
        <Show when={providerNotFound()}>
          <Card class="border border-primary/10 mb-4">
            <div class="p-6 text-center">
              <h2 class="text-lg font-semibold text-[#3d2e0a] mb-2">Provider not found</h2>
              <p class="text-sm text-[#5a4510] mb-4">
                No provider account exists for "{providerUsername()}".
              </p>
              <A href="/" class="text-sm text-[#8B6914] hover:underline">
                Go to home page
              </A>
            </div>
          </Card>
        </Show>

        {/* Client Info Form — Step 0 */}
        <Show when={!providerNotFound() && !clientInfoSubmitted()}>
          <Card class="border border-primary/10 mb-4">
            <div class="p-6">
              <h2 class="text-lg font-semibold text-[#3d2e0a] mb-4">Book for a Client</h2>
              <p class="text-sm text-[#5a4510] mb-6">
                Enter the client's information to book an appointment on their behalf.
              </p>
              <form onSubmit={handleClientInfoSubmit} class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-[#5a4510] mb-1">
                    Client Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={clientName()}
                    onInput={(e) => setClientName(e.currentTarget.value)}
                    required
                    class="w-full px-3 py-2 border border-[#8B6914]/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6914]/50"
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-[#5a4510] mb-1">
                    Email <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={clientEmail()}
                    onInput={(e) => setClientEmail(e.currentTarget.value)}
                    required
                    class="w-full px-3 py-2 border border-[#8B6914]/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6914]/50"
                    placeholder="jane@example.com"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-[#5a4510] mb-1">
                    Phone <span class="text-muted-foreground">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={clientPhone()}
                    onInput={(e) => setClientPhone(e.currentTarget.value)}
                    class="w-full px-3 py-2 border border-[#8B6914]/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6914]/50"
                    placeholder="555-123-4567"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!isClientInfoValid()}
                  class="w-full py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#8B6914] hover:bg-[#6d5410] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Continue to Service Selection
                </button>
              </form>
            </div>
          </Card>
        </Show>

        {/* Booking flow — steps 1-5, shown after client info submitted */}
        <Show when={!providerNotFound() && clientInfoSubmitted()}>
          {/* Client info banner */}
          <Show when={!step().showAppointmentConfirmed}>
            <Card class="border border-primary/10 mb-4">
              <div class="p-4 flex justify-between items-center">
                <div class="text-sm text-[#5a4510]">
                  Booking for: <span class="font-medium text-[#3d2e0a]">{clientName()}</span>
                  <span class="text-[#8B6914] ml-2">({clientEmail()})</span>
                </div>
                <button
                  onClick={() => setClientInfoSubmitted(false)}
                  class="text-xs text-[#8B6914] hover:underline"
                >
                  Change
                </button>
              </div>
            </Card>
          </Show>

          {/* Service Selection */}
          <Show when={step().showServices}>
            <ServiceSelectionStep
              services={uniqueServices()}
              appointmentCount={0}
              appointmentRequestCap={999}
              onSelectService={booking.actions.selectService}
            />
          </Show>

          {/* Duration Selection */}
          <Show when={step().showDurations}>
            <DurationSelectionStep
              selectedServiceName={booking.state.selectedService!}
              serviceDescription={uniqueServices().find(s => s.name === booking.state.selectedService)?.description ?? ''}
              durations={serviceDurations()}
              onSelectDuration={booking.actions.selectDuration}
              onEditService={booking.actions.unselectService}
            />
          </Show>

          {/* Loading Slots */}
          <Show when={step().showLoadingSlots || (booking.state.selectedDuration !== null && availableSlots.loading)}>
            <LoadingSlotsStep
              selectedServiceName={booking.state.selectedService!}
              serviceDescription={selectedServiceData()?.description ?? ''}
              selectedDuration={booking.state.selectedDuration!}
              durationDescription={selectedServiceData()?.durationDescription || ''}
              price={selectedServiceData()?.price || 0}
            />
          </Show>

          {/* Slot fetch error */}
          <Show when={availableSlots.error}>
            <Card class="border border-red-200 mb-4">
              <div class="p-4 text-center">
                <p class="text-sm text-red-600 mb-2">Failed to load available time slots.</p>
                <button
                  onClick={() => booking.actions.unselectDuration()}
                  class="text-sm text-[#8B6914] hover:underline"
                >
                  Try again
                </button>
              </div>
            </Card>
          </Show>

          {/* Time Slot Selection */}
          <Show when={step().showSlotSelection && !availableSlots.loading && !availableSlots.error && booking.state.selectedDuration !== null}>
            <TimeSlotSelectionStep
              selectedServiceName={booking.state.selectedService!}
              serviceDescription={selectedServiceData()?.description || ''}
              selectedDuration={booking.state.selectedDuration!}
              durationDescription={selectedServiceData()?.durationDescription || ''}
              price={selectedServiceData()?.price || 0}
              groupedSlots={groupedSlots()}
              onSelectSlot={booking.actions.selectSlot}
              onEditService={booking.actions.unselectService}
              onEditDuration={booking.actions.unselectDuration}
            />
          </Show>

          {/* Booking error */}
          <Show when={bookingError()}>
            <Card class="border border-red-200 mb-4">
              <div class="p-4 text-center">
                <p class="text-sm text-red-600">{bookingError()}</p>
              </div>
            </Card>
          </Show>

          {/* Confirmation */}
          <Show when={step().showConfirmation || step().showCreatingAppointment}>
            <BookingConfirmationStep
              serviceName={booking.state.selectedService!}
              serviceDescription={selectedServiceData()?.description || ''}
              duration={booking.state.selectedDuration!}
              slot={booking.state.selectedSlot!}
              price={selectedServiceData()?.price || 0}
              isSubmitting={step().showCreatingAppointment}
              isSuccess={isBookingSuccess()}
              progress={bookingProgress()}
              onConfirm={handleConfirm}
              onBack={booking.actions.goBackToSlots}
            />
          </Show>

          {/* Success */}
          <Show when={step().showAppointmentConfirmed}>
            <BookingSuccessStep
              onBookAnother={handleBookAnother}
            />
          </Show>
        </Show>
      </Content>
    </PageFrame>
  );
}
