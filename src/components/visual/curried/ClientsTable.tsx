import { For, Show } from 'solid-js';

interface Client {
  preferredName: string;
  pronouns?: string;
  createdAt: string;
  houseCalls: boolean;
  cap: number;
  notes?: string;
}

interface ClientsTableProps {
  clients: Client[];
}

export function ClientsTable(props: ClientsTableProps) {
  return (
    <Show 
      when={props.clients.length > 0}
      fallback={<p class="text-sm text-[#5a4510]">No clients yet</p>}
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-[#f5f0e6]">
              <th class="text-left py-2 px-4 text-sm font-medium text-[#5a4510]">Preferred Name</th>
              <th class="text-left py-2 px-4 text-sm font-medium text-[#5a4510]">Pronouns</th>
              <th class="text-left py-2 px-4 text-sm font-medium text-[#5a4510]">Created At</th>
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
                  <td class="py-2 px-4 text-sm text-[#3d2e0a]">{client.pronouns || '—'}</td>
                  <td class="py-2 px-4 text-sm text-[#3d2e0a]">{client.createdAt}</td>
                  <td class="py-2 px-4 text-sm text-[#3d2e0a]">{client.houseCalls ? 'Yes' : 'No'}</td>
                  <td class="py-2 px-4 text-sm text-[#3d2e0a]">{client.cap}</td>
                  <td class="py-2 px-4 text-sm text-[#3d2e0a]">{client.notes || '—'}</td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </Show>
  );
}

