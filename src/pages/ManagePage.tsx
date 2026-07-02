import { createResource, createSignal, For, Show } from 'solid-js';
import { useParams } from '@solidjs/router';
import {
  cancelViaToken,
  type ManageDetails,
  resolveManage,
  rescheduleViaToken,
} from '../services/manageService';
import { type AvailableSlot, getAvailableSlots } from '../services/availabilityService';
import { formatStartForBackend } from '../utils/pacificTime';

const PT = 'America/Los_Angeles';

function dateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    timeZone: PT, weekday: 'short', month: 'short', day: 'numeric',
  });
}
function timeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    timeZone: PT, hour: 'numeric', minute: '2-digit',
  });
}
function whenLabel(iso: string): string {
  return `${dateLabel(iso)} at ${timeLabel(iso)}`;
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

type View = 'details' | 'reschedule' | 'done';

export function ManagePage() {
  const params = useParams();
  const token = () => params.token;

  const [resolved, { refetch: refetchDetails }] = createResource(token, resolveManage);
  const [view, setView] = createSignal<View>('details');
  const [doneMsg, setDoneMsg] = createSignal('');
  const [busy, setBusy] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [selected, setSelected] = createSignal<AvailableSlot | null>(null);

  const details = (): ManageDetails | null => {
    const r = resolved();
    return r && r.ok ? r.details : null;
  };

  const badReason = (): 'expired' | 'invalid' | 'error' | null => {
    const r = resolved();
    return r && !r.ok ? r.reason : null;
  };

  const [slots] = createResource(
    () => (view() === 'reschedule' ? details() : null),
    async (d: ManageDetails) =>
      await getAvailableSlots(d.service, d.durationMinutes, d.clientEmail, d.username),
  );

  const doCancel = async () => {
    setError(null);
    setBusy(true);
    try {
      await cancelViaToken(token());
      setDoneMsg('Your appointment has been cancelled.');
      setView('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Cancel failed');
    } finally {
      setBusy(false);
    }
  };

  const doReschedule = async () => {
    const slot = selected();
    if (!slot) return;
    setError(null);
    setBusy(true);
    try {
      await rescheduleViaToken(token(), formatStartForBackend(slot.startTime));
      setDoneMsg(`Your appointment has been moved to ${whenLabel(slot.startTime)}.`);
      setView('done');
      // Refresh the detail card from the backend (calendar = source of truth) so it shows the
      // new time instead of the stale one. Fire-and-forget: the reschedule already succeeded, so a
      // refetch hiccup must not surface as a reschedule error.
      Promise.resolve(refetchDetails()).catch(() => {});
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Reschedule failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div class="max-w-lg mx-auto p-6">
      <h1 class="text-xl font-semibold text-[#3d2e0a] mb-4">Manage your appointment</h1>

      <Show when={resolved.loading}>
        <p class="text-sm text-[#5a4510]">Loading…</p>
      </Show>

      {/* Terminal: bad token */}
      <Show when={badReason()}>
        {(reason) => (
          <p class="text-sm text-red-600">
            {reason() === 'expired'
              ? 'This link has expired. Please contact your provider.'
              : 'This link is invalid. Please contact your provider.'}
          </p>
        )}
      </Show>

      <Show when={details()}>
        {(d) => (
          <>
            {/* Terminal: already cancelled / gone */}
            <Show when={d().status === 'not_found'}>
              <p class="text-sm text-[#5a4510]">
                This appointment no longer exists — it may have already been cancelled.
              </p>
            </Show>

            <Show when={d().status !== 'not_found'}>
              <div class="rounded-lg border border-[#8B6914]/20 p-4 mb-4">
                <div class="text-[#3d2e0a] font-medium">{d().service}</div>
                <div class="text-sm text-[#5a4510]">with {d().providerName}</div>
                <div class="text-sm text-[#5a4510] mt-1">{whenLabel(d().startTime)}</div>
              </div>

              <Show when={d().status === 'past'}>
                <p class="text-sm text-[#5a4510]">
                  This appointment has already passed and can no longer be changed.
                </p>
              </Show>

              {/* Done */}
              <Show when={view() === 'done'}>
                <p class="text-sm text-green-700">{doneMsg()}</p>
              </Show>

              {/* Details actions */}
              <Show when={d().status === 'active' && view() === 'details'}>
                <Show when={error()}>
                  <p class="text-sm text-red-600 mb-3">{error()}</p>
                </Show>
                <div class="flex gap-3">
                  <button
                    class="px-4 py-2 text-sm rounded bg-[#8B6914] text-white disabled:opacity-50"
                    disabled={busy()}
                    onClick={() => { setError(null); setView('reschedule'); }}
                  >
                    Reschedule
                  </button>
                  <button
                    class="px-4 py-2 text-sm rounded border border-red-500 text-red-600 disabled:opacity-50"
                    disabled={busy()}
                    onClick={doCancel}
                  >
                    {busy() ? 'Cancelling…' : 'Cancel appointment'}
                  </button>
                </div>
              </Show>

              {/* Reschedule picker (mirrors RescheduleModal) */}
              <Show when={view() === 'reschedule'}>
                <div class="mt-2">
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

                  <Show when={error()}>
                    <p class="text-sm text-red-600 mb-3">{error()}</p>
                  </Show>
                  <div class="flex justify-end gap-3 mt-2">
                    <button
                      class="px-4 py-2 text-sm text-[#5a4510] hover:underline disabled:opacity-50"
                      disabled={busy()}
                      onClick={() => { setSelected(null); setError(null); setView('details'); }}
                    >
                      Back
                    </button>
                    <button
                      class="px-4 py-2 text-sm rounded bg-[#8B6914] text-white disabled:opacity-50"
                      disabled={!selected() || busy()}
                      onClick={doReschedule}
                    >
                      {busy() ? 'Rescheduling…' : 'Confirm new time'}
                    </button>
                  </div>
                </div>
              </Show>
            </Show>
          </>
        )}
      </Show>
    </div>
  );
}
