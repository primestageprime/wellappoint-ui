import { For } from 'solid-js';

interface ConfigRow {
  name: string;
  value: string | number | undefined;
}

interface ConfigTableProps {
  rows: ConfigRow[];
}

export function ConfigTable(props: ConfigTableProps) {
  return (
    <table class="w-full">
      <thead>
        <tr class="bg-[#f5f0e6]">
          <th class="text-left py-2 px-4 text-sm font-medium text-[#5a4510]">Name</th>
          <th class="text-left py-2 px-4 text-sm font-medium text-[#5a4510]">Value</th>
        </tr>
      </thead>
      <tbody>
        <For each={props.rows}>
          {(row) => (
            <tr class="border-b border-[#8B6914]/10">
              <td class="py-2 px-4 text-sm text-[#5a4510]">{row.name}</td>
              <td class="py-2 px-4 text-sm text-[#8B6914]">{row.value || '—'}</td>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
}

