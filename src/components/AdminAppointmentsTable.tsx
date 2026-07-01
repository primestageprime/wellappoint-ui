import { createSignal, For, Show } from 'solid-js';
import { cancelAppointment, type ProviderAppointment } from '../services/appointmentService';
import { RescheduleModal } from './RescheduleModal';

interface AdminAppointmentsTableProps {
  appointments: ProviderAppointment[];
  username: string;
  onChanged: () => void;
}

export function AdminAppointmentsTable(props: AdminAppointmentsTableProps) {
  const [rescheduling, setRescheduling] = createSignal<ProviderAppointment | null>(null);
  const [busyId, setBusyId] = createSignal<string | null>(null);
  const [error, setError] = createSignal<string | null>(null);

  const doCancel = async (appt: ProviderAppointment) => {
    const ok = confirm(
      `Cancel ${appt.service} for ${appt.clientEmail} on ${appt.date} at ${appt.time}?\n\n` +
        `The client will be emailed a cancellation.`,
    );
    if (!ok) return;
    setError(null);
    setBusyId(appt.appointmentId);
    try {
      await cancelAppointment(props.username, appt.appointmentId);
      props.onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Cancel failed');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <Show when={error()}>
        <p class="text-sm text-red-600 mb-2">{error()}</p>
      </Show>
      <Show
        when={props.appointments.length > 0}
        fallback={<p class="text-sm text-[#5a4510]">No upcoming appointments</p>}
      >
        {/* Table view for large screens */}
        <div class="hidden lg:block overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-[#f5f0e6]">
                <th class="text-left py-2 px-4 text-sm font-medium text-[#5a4510]">Date</th>
                <th class="text-left py-2 px-4 text-sm font-medium text-[#5a4510]">Time</th>
                <th class="text-left py-2 px-4 text-sm font-medium text-[#5a4510]">Service</th>
                <th class="text-left py-2 px-4 text-sm font-medium text-[#5a4510]">Client</th>
                <th class="text-right py-2 px-4 text-sm font-medium text-[#5a4510]">Actions</th>
              </tr>
            </thead>
            <tbody>
              <For each={props.appointments}>
                {(appt) => (
                  <tr class="border-b border-[#8B6914]/10">
                    <td class="py-2 px-4 text-sm text-[#3d2e0a]">{appt.date}</td>
                    <td class="py-2 px-4 text-sm text-[#3d2e0a]">{appt.time}</td>
                    <td class="py-2 px-4 text-sm text-[#8B6914] font-medium">{appt.service}</td>
                    <td class="py-2 px-4 text-sm text-[#3d2e0a]">{appt.clientEmail}</td>
                    <td class="py-2 px-4 text-sm text-right whitespace-nowrap">
                      <button
                        class="text-[#8B6914] hover:underline disabled:opacity-50 mr-3"
                        disabled={busyId() === appt.appointmentId}
                        onClick={() => setRescheduling(appt)}
                      >
                        Reschedule
                      </button>
                      <button
                        class="text-red-600 hover:underline disabled:opacity-50"
                        disabled={busyId() === appt.appointmentId}
                        onClick={() => doCancel(appt)}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>

        {/* Card view for smaller screens */}
        <div class="lg:hidden">
          <For each={props.appointments}>
            {(appt) => (
              <div class="bg-gray-100 rounded-lg p-4 mb-3">
                <div class="text-base font-medium text-[#8B6914] mb-1">{appt.service}</div>
                <div class="text-sm text-[#3d2e0a] mb-1">
                  {appt.date} at {appt.time}
                </div>
                <div class="text-sm text-[#5a4510] mb-3">{appt.clientEmail}</div>
                <div class="flex gap-4">
                  <button
                    class="text-sm text-[#8B6914] hover:underline disabled:opacity-50"
                    disabled={busyId() === appt.appointmentId}
                    onClick={() => setRescheduling(appt)}
                  >
                    Reschedule
                  </button>
                  <button
                    class="text-sm text-red-600 hover:underline disabled:opacity-50"
                    disabled={busyId() === appt.appointmentId}
                    onClick={() => doCancel(appt)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>

      <Show when={rescheduling()}>
        {(appt) => (
          <RescheduleModal
            appointment={appt()}
            username={props.username}
            onClose={() => setRescheduling(null)}
            onDone={() => {
              setRescheduling(null);
              props.onChanged();
            }}
          />
        )}
      </Show>
    </>
  );
}
