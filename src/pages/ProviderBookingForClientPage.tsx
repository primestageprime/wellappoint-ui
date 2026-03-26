import { Show, createMemo, createResource, createSignal } from 'solid-js';
import { useAuth } from '../auth/AuthProvider';
import { useParams, A } from '@solidjs/router';
import { taskMetrics } from '../utils/taskMetrics';
import { animateProgress } from '../utils/progressAnimation';
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
import { useBooking } from '../stores/bookingStore';
import { useServices } from '../stores/servicesStore';
import { getAvailableSlots } from '../services/availabilityService';
import { createAppointment, createBookingRequest } from '../services/bookingService';
import { getProviderDetails, ProviderNotFoundError } from '../services/providerService';
import { type BookingService } from '../types/service';
import { type AvailableSlot } from '../types/global';
import { groupSlotsByDate } from '../utils/slotFormatting';

export function ProviderBookingForClientPage() {
  const auth = useAuth();
  const params = useParams();
  const booking = useBooking();
  const servicesStore = useServices();

  const providerUsername = () => params.username as string;

  // Client info state
  const [clientName, setClientName] = createSignal('');
  const [clientEmail, setClientEmail] = createSignal('');
  const [clientPhone, setClientPhone] = createSignal('');
  const [clientInfoSubmitted, setClientInfoSubmitted] = createSignal(false);

  // Provider validation
  const [provider] = createResource(providerUsername, getProviderDetails);
  const providerNotFound = createMemo(() =>
    provider.error instanceof ProviderNotFoundError
  );

  // Booking progress state
  const [isBookingSuccess, setIsBookingSuccess] = createSignal(false);
  const [bookingProgress, setBookingProgress] = createSignal(0);
  const [bookingError, setBookingError] = createSignal<string | null>(null);

  // Validation
  const isClientInfoValid = () =>
    clientName().trim().length > 0 && clientEmail().trim().length > 0;

  const handleClientInfoSubmit = (e: Event) => {
    e.preventDefault();
    if (isClientInfoValid()) {
      setClientInfoSubmitted(true);
    }
  };

  // Current step — show client info form first, then booking steps
  const step = () => booking.currentStep();

  // Services
  const uniqueServices = createMemo(() => {
    const services = servicesStore.services();
    if (!services) return [];
    const serviceMap = new Map<string, BookingService>();
    services.forEach(service => {
      if (!serviceMap.has(service.name)) {
        serviceMap.set(service.name, service);
      }
    });
    return Array.from(serviceMap.values());
  });

  const serviceDurations = createMemo(() => {
    const services = servicesStore.services();
    const selected = booking.state.selectedService;
    if (!services || !selected) return [];
    return services.filter(s => s.name === selected);
  });

  const selectedServiceData = createMemo(() => {
    const services = servicesStore.services();
    const selected = booking.state.selectedService;
    const duration = booking.state.selectedDuration;
    if (!services || !selected || !duration) return null;
    return services.find(s => s.name === selected && s.duration === duration);
  });

  // Fetch available slots using client email
  const [availableSlots] = createResource(
    () => {
      const service = booking.state.selectedService;
      const duration = booking.state.selectedDuration;
      const email = clientEmail();
      const provider = providerUsername();
      return service && duration && email
        ? { service, duration, email, provider }
        : null;
    },
    async (params) => {
      const startTime = Date.now();
      try {
        const result = await getAvailableSlots(
          params.service,
          params.duration,
          params.email,
          params.provider
        );
        const elapsedMs = Date.now() - startTime;
        taskMetrics.recordTask('loading-time-slots', elapsedMs);
        return result;
      } catch (error) {
        const elapsedMs = Date.now() - startTime;
        taskMetrics.recordTask('loading-time-slots', elapsedMs);
        throw error;
      }
    }
  );

  const groupedSlots = createMemo(() => groupSlotsByDate(availableSlots() || []));

  // Build booking request with client info
  const buildRequest = (slot: AvailableSlot) => {
    const request = createBookingRequest(
      booking.state.selectedService!,
      booking.state.selectedDuration!,
      slot,
      clientEmail(),
      providerUsername(),
    );
    return {
      ...request,
      userProfile: {
        name: clientName(),
        ...(clientPhone().trim() ? { phone: clientPhone().trim() } : {}),
      },
    };
  };

  const handleConfirm = async () => {
    const slot = booking.state.selectedSlot;
    if (!slot || !booking.state.selectedService || !booking.state.selectedDuration) {
      return;
    }

    booking.actions.setSubmitting(true);
    setBookingProgress(0);

    const stopProgress = animateProgress(
      10000,
      (progress) => setBookingProgress(progress),
      () => {}
    );

    const startTime = Date.now();

    try {
      const bookingRequest = buildRequest(slot);
      const result = await createAppointment(bookingRequest);
      const elapsedMs = Date.now() - startTime;
      taskMetrics.recordTask('booking-appointment', elapsedMs);

      if (result.success) {
        stopProgress();
        setBookingProgress(100);
        booking.actions.setSubmitting(false);
        setIsBookingSuccess(true);
        setTimeout(() => {
          booking.actions.setConfirmed(true);
          setIsBookingSuccess(false);
          setBookingProgress(0);
        }, 800);
      } else {
        stopProgress();
        console.error('Appointment creation failed:', result.error);
        setBookingError(result.error || 'Failed to create appointment');
        booking.actions.setSubmitting(false);
        setIsBookingSuccess(false);
      }
    } catch (error) {
      console.error('Booking error:', error);
      const elapsedMs = Date.now() - startTime;
      taskMetrics.recordTask('booking-appointment', elapsedMs);
      stopProgress();
      setBookingError(error instanceof Error ? error.message : 'Failed to create appointment');
      booking.actions.setSubmitting(false);
      setIsBookingSuccess(false);
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
