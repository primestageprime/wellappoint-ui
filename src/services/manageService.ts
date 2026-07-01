import { apiFetch } from '../config/api';

export interface ManageDetails {
  status: 'active' | 'past' | 'not_found';
  username: string;
  providerName: string;
  service: string;
  clientEmail: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

export type ResolveManageResult =
  | { ok: true; details: ManageDetails }
  | { ok: false; reason: 'expired' | 'invalid' | 'error' };

export async function resolveManage(token: string): Promise<ResolveManageResult> {
  const res = await apiFetch(`/api/appointments/manage?token=${encodeURIComponent(token)}`);
  if (res.status === 401) {
    const body = await res.json().catch(() => ({}));
    return { ok: false, reason: body.error === 'expired' ? 'expired' : 'invalid' };
  }
  if (!res.ok) {
    return { ok: false, reason: 'error' };
  }
  const data = await res.json();
  return {
    ok: true,
    details: {
      status: data.status,
      username: data.username,
      providerName: data.providerName,
      service: data.service,
      clientEmail: data.clientEmail,
      startTime: data.startTime,
      endTime: data.endTime,
      durationMinutes: data.durationMinutes,
    },
  };
}

export async function cancelViaToken(token: string, reason?: string): Promise<void> {
  const res = await apiFetch('/api/appointments/manage/cancel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, reason }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Failed to cancel (${res.status})`);
  }
}

export async function rescheduleViaToken(token: string, newStart: string): Promise<void> {
  const res = await apiFetch('/api/appointments/manage/reschedule', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newStart }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Failed to reschedule (${res.status})`);
  }
}
