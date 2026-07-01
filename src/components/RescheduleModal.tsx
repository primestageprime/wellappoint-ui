import { createResource, createSignal, For, Show } from 'solid-js';
import {
  type ProviderAppointment,
  rescheduleAppointment,
} from '../services/appointmentService';
import { type AvailableSlot, getAvailableSlots } from '../services/availabilityService';
import { formatStartForBackend } from '../utils/pacificTime';

interface RescheduleModalProps {
  appointment: ProviderAppointment;
  username: string;
  onClose: () => void;
  onDone: () => void;
}

const PT = 'America/Los_Angeles';

function dateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    timeZone: PT,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function timeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    timeZone: PT,
    hour: 'numeric',
    minute: '2-digit',
  });
}

function groupByDate(slots: AvailableSlot[]): { date: string; slots: AvailableSlot[] }[] {
  const groups = new Map<string, AvailableSlot[]>();
  for (const slot of slots) {
    const key = dateLabel(slot.startTime);
    const list = groups.get(key) ?? [];
    list.push(slot);
    groups.set(key, list);
  }
  return [...groups.entries()].map(([date, slots]) => ({ date, slots }));
}

export function RescheduleModal(props: RescheduleModalProps) {
  const [selected, setSelected] = createSignal<AvailableSlot | null>(null);
  const [submitting, setSubmitting] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const [slots] = createResource(async () => {
    return await getAvailableSlots(
      props.appointment.service,
      props.appointment.duration,
      props.appointment.clientEmail,
      props.username,
    );
  });

  const confirm = async () => {
    const slot = selected();
    if (!slot) return;
    setError(null);
    setSubmitting(true);
    try {
      await rescheduleAppointment(
        props.username,
        props.appointment.appointmentId,
        formatStartForBackend(slot.startTime),
      );
      props.onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Reschedule failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[85vh] flex flex-col">
        <div class="p-5 border-b border-[#8B6914]/10">
          <h3 class="text-lg font-semibold text-[#3d2e0a]">Reschedule appointment</h3>
          <p class="text-sm text-[#5a4510] mt-1">
            {props.appointment.service} — {props.appointment.clientEmail}
          </p>
          <p class="text-sm text-[#5a4510]">
            Currently {props.appointment.date} at {props.appointment.time}
          </p>
        </div>

        <div class="p-5 overflow-y-auto flex-1">
          <Show when={slots.loading}>
            <p class="text-sm text-[#5a4510]">Finding available times…</p>
          </Show>
          <Show when={slots.error}>
            <p class="text-sm text-red-600">Failed to load available times.</p>
          </Show>
          <Show when={!slots.loading && (slots() ?? []).length === 0}>
            <p class="text-sm text-[#5a4510]">No open slots in the booking window.</p>
          </Show>

          <For each={groupByDate(slots() ?? [])}>
            {(group) => (
              <div class="mb-4">
                <div class="text-sm font-medium text-[#8B6914] mb-2">{group.date}</div>
                <div class="flex flex-wrap gap-2">
                  <For each={group.slots}>
                    {(slot) => (
                      <button
                        class={`px-3 py-1.5 rounded border text-sm ${
                          selected()?.startTime === slot.startTime
                            ? 'bg-[#8B6914] text-white border-[#8B6914]'
                            : 'bg-white text-[#3d2e0a] border-[#8B6914]/30 hover:border-[#8B6914]'
                        }`}
                        onClick={() => setSelected(slot)}
                      >
                        {timeLabel(slot.startTime)}
                      </button>
                    )}
                  </For>
                </div>
              </div>
            )}
          </For>
        </div>

        <div class="p-5 border-t border-[#8B6914]/10">
          <Show when={error()}>
            <p class="text-sm text-red-600 mb-3">{error()}</p>
          </Show>
          <div class="flex justify-end gap-3">
            <button
              class="px-4 py-2 text-sm text-[#5a4510] hover:underline disabled:opacity-50"
              disabled={submitting()}
              onClick={() => props.onClose()}
            >
              Close
            </button>
            <button
              class="px-4 py-2 text-sm rounded bg-[#8B6914] text-white disabled:opacity-50"
              disabled={!selected() || submitting()}
              onClick={confirm}
            >
              {submitting() ? 'Rescheduling…' : 'Confirm new time'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
