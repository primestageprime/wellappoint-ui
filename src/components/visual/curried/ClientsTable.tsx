import { For, Show } from 'solid-js';

interface Client {
  email?: string;
  preferredName: string;
  pronouns?: string;
  createdAt: string;
  updatedAt?: string;
  houseCalls: boolean;
  cap: number;
  notes?: string;
  address?: string;
  phone?: string;
}

interface ClientsTableProps {
  clients: Client[];
}

function ClientCard(props: { client: Client }) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  return (
    <div class="bg-gray-100 rounded-lg p-4 mb-3">
      {/* Preferred Name */}
      <div class="text-base font-medium text-[#8B6914] mb-2">{props.client.preferredName}</div>
      
      {/* Email */}
      <div class="text-sm text-[#3d2e0a] mb-1">{props.client.email || '—'}</div>
      
      {/* Created At */}
      <div class="text-sm text-[#5a4510] mb-1">Created: {formatDate(props.client.createdAt)}</div>
      
      {/* Pronouns */}
      <div class="text-sm text-[#3d2e0a] mb-1">Pronouns: {props.client.pronouns || '—'}</div>
      
      {/* House Calls & Cap */}
      <div class="flex gap-4 text-sm text-[#3d2e0a]">
        <span>House Calls: {props.client.houseCalls ? 'Yes' : 'No'}</span>
        <span>Cap: {props.client.cap}</span>
      </div>
    </div>
  );
}

export function ClientsTable(props: ClientsTableProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  return (
    <Show 
      when={props.clients.length > 0}
      fallback={<p class="text-sm text-[#5a4510]">No clients yet</p>}
    >
      {/* Table view for large screens (>=1024px) */}
      <div class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-[#f5f0e6]">
              <th class="text-left py-2 px-4 text-sm font-medium text-[#5a4510]">Preferred Name</th>
              <th class="text-left py-2 px-4 text-sm font-medium text-[#5a4510]">Email</th>
              <th class="text-left py-2 px-4 text-sm font-medium text-[#5a4510]">Pronouns</th>
              <th class="text-left py-2 px-4 text-sm font-medium text-[#5a4510]">Created</th>
              <th class="text-left py-2 px-4 text-sm font-medium text-[#5a4510]">House Calls</th>
              <th class="text-left py-2 px-4 text-sm font-medium text-[#5a4510]">Cap</th>
              <th class="text-left py-2 px-4 text-sm font-medium text-[#5a4510]">Notes</th>
            </tr>
          </thead>
          <tbody>
            <For each={props.clients}>
              {(client) => (
                <tr class="border-b border-[#8B6914]/10">
                  <td class="py-2 px-4 text-sm text-[#8B6914] font-medium">{client.preferredName}</td>
                  <td class="py-2 px-4 text-sm text-[#3d2e0a]">{client.email || '—'}</td>
                  <td class="py-2 px-4 text-sm text-[#3d2e0a]">{client.pronouns || '—'}</td>
                  <td class="py-2 px-4 text-sm text-[#3d2e0a]">{formatDate(client.createdAt)}</td>
                  <td class="py-2 px-4 text-sm text-[#3d2e0a]">{client.houseCalls ? 'Yes' : 'No'}</td>
                  <td class="py-2 px-4 text-sm text-[#3d2e0a]">{client.cap}</td>
                  <td class="py-2 px-4 text-sm text-[#3d2e0a]">{client.notes || '—'}</td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>

      {/* Card view for smaller screens (<1024px) */}
      <div class="lg:hidden">
        <For each={props.clients}>
          {(client) => <ClientCard client={client} />}
        </For>
      </div>
    </Show>
  );
}

