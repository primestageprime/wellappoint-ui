import { For } from 'solid-js';

interface LegalListProps {
  items: string[];
}

export function LegalList(props: LegalListProps) {
  return (
    <ul class="list-disc list-inside space-y-2 ml-4">
      <For each={props.items}>
        {(item) => <li>{item}</li>}
      </For>
    </ul>
  );
}

