import { For } from 'solid-js';
import { AppointmentsContainer, AppointmentItem } from './visual';

export function AppointmentsCard() {
  // Stub data for now
  const appointments = [
    {
      service: 'Therapeutic Massage',
      duration: '60 minutes',
      date: '8/27/2025',
      time: '2:00 PM'
    }
  ];

  return (
    <AppointmentsContainer 
      appointmentRequestCap={3} 
      appointmentCount={appointments.length}
    >
      <For each={appointments}>
        {(appointment) => (
          <AppointmentItem
            service={appointment.service}
            duration={appointment.duration}
            date={appointment.date}
            time={appointment.time}
          />
        )}
      </For>
    </AppointmentsContainer>
  );
}
