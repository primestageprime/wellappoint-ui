import { Show, createMemo } from 'solid-js';
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
  ProviderContent,
} from '../components/visual';
import {
  AppointmentsList,
  ServiceSelectionStep,
  DurationSelectionStep,
  LoadingSlotsStep,
  TimeSlotSelectionStep,
  BookingConfirmationStep,
  BookingSuccessStep,
} from '../components/booking';
import { useAppointments } from '../hooks/useAppointments';
import { useBookingFlow } from '../hooks/useBookingFlow';
import { type UserAppointmentsResponse } from '../types/global';

function isAppointmentsResponse(value: unknown): value is UserAppointmentsResponse {
  return value != null && typeof value === 'object' && !Array.isArray(value) && 'appointments' in value;
}

export function ProviderBookingPage() {
  const auth = useAuth();
  const userEmail = () => auth.user()?.email;

  const flow = useBookingFlow({
    email: userEmail,
    onSuccess: () => appointments.refetchAppointments(),
  });

  const appointments = useAppointments(() => userEmail(), () => flow.providerUsername());

  const {
    providerUsername, provider, providerNotFound, booking, step,
    uniqueServices, serviceDurations, selectedServiceData,
    availableSlots, groupedSlots, isBookingSuccess, bookingProgress,
    bookingError, handleConfirm,
  } = flow;

  const appointmentsResponse = createMemo(() => {
    const apts = appointments.appointments();
    return isAppointmentsResponse(apts) ? apts : null;
  });

  const loggedInUsername = createMemo(() => {
    const response = appointmentsResponse();
    if (response?.displayName) return response.displayName;
    return auth.user()?.nickname || auth.user()?.email?.split('@')[0] || '';
  });

  const isProviderAdmin = createMemo(() => {
    const user = auth.user();
    if (!user) return false;
    const userUsername = user.nickname || user.email?.split('@')[0];
    return userUsername === providerUsername();
  });

  return (
    <PageFrame>
      <HeaderCard>
        <Split
          left={<Avatar username={loggedInUsername} />}
          right={
            <div class="flex items-center gap-2">
              <Show when={isProviderAdmin()}>
                <A
                  href={`/admin/${providerUsername()}`}
                  class="text-primary hover:text-primary/80 px-2"
                >
                  Admin
                </A>
              </Show>
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
                We couldn't find a provider with the username "{providerUsername()}". They may have moved or the link may be incorrect.
              </p>
              <A href="/" class="text-sm text-[#8B6914] hover:underline">
                Go to home page
              </A>
            </div>
          </Card>
        </Show>

        {/* Provider Profile Card */}
        {provider() && (
          <Card class="border border-primary/10 mb-4">
            <ProviderContent
              name={provider()!.name}
              email={provider()!.email}
              phone={provider()!.phone}
              title={provider()!.title}
              location={provider()!.location}
              profilePic={provider()!.headshot}
            />
          </Card>
        )}

        {/* Show appointments if they exist - but not on receipt page (receipt has its own) */}
        <Show when={!step().showAppointmentConfirmed && appointmentsResponse()}>
          <AppointmentsList appointments={appointmentsResponse()!} />
        </Show>
        
        {/* STEP 1: Choose Service */}
        <Show when={step().showServices}>
          <ServiceSelectionStep
            services={uniqueServices()}
            appointmentCount={appointmentsResponse()?.appointments.length ?? 0}
            appointmentRequestCap={appointmentsResponse()?.appointmentRequestCap ?? 1}
            onSelectService={booking.actions.selectService}
          />
        </Show>
        
        {/* STEP 2: Choose Duration */}
        <Show when={step().showDurations}>
          <DurationSelectionStep
            selectedServiceName={booking.state.selectedService!}
            serviceDescription={uniqueServices().find(s => s.name === booking.state.selectedService)?.description ?? ''}
            durations={serviceDurations()}
            onSelectDuration={booking.actions.selectDuration}
            onEditService={booking.actions.unselectService}
          />
        </Show>
        
        {/* STEP 3: Loading Slots - Show when state machine says loading OR when resource is still loading */}
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

        {/* STEP 4: Choose Slot - Only show when NOT loading and we have a duration selected */}
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

        {/* STEP 5: Confirmation & STEP 6: Processing */}
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
        
        {/* STEP 7: Success */}
        <Show when={step().showAppointmentConfirmed}>
          <BookingSuccessStep
            appointments={appointmentsResponse() ?? undefined}
            onBookAnother={booking.actions.reset}
          />
        </Show>
      </Content>
    </PageFrame>
  );
}

