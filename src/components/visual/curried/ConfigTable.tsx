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
    <div class="space-y-2">
      <For each={props.rows}>
        {(row) => (
          <div class="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3 py-1.5 border-b border-[#8B6914]/10 last:border-0">
            <span class="text-xs font-medium text-[#5a4510] sm:w-28 sm:flex-shrink-0">
              {row.name}
            </span>
            <span class="text-sm text-[#3d2e0a]">
              {row.value || '—'}
            </span>
          </div>
        )}
      </For>
    </div>
  );
}
