import { JSX } from 'solid-js';

interface DetailItemProps {
  icon: JSX.Element;
  label: string;
  value: string;
  class?: string;
}

export function DetailItem(props: DetailItemProps) {
  return (
    <div class={`flex items-start gap-3 ${props.class || ''}`}>
      <div class="mt-1">{props.icon}</div>
      <div class="flex-1">
        <div class="text-sm text-muted-foreground">{props.label}</div>
        <div class="text-base font-medium text-primary">{props.value}</div>
      </div>
    </div>
  );
}

