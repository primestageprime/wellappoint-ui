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
    <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
      <For each={props.rows}>
        {(row) => (
          <>
            <span class="text-sm font-medium text-[#5a4510] py-1">
              {row.name}
            </span>
            <span class="text-sm text-[#3d2e0a] py-1 border-b border-[#8B6914]/10">
              {row.value || '—'}
            </span>
          </>
        )}
      </For>
    </div>
  );
}
