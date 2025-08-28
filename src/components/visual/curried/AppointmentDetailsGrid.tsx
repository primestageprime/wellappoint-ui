import { JSX } from 'solid-js';

interface DetailItem {
  label: string;
  value: string | JSX.Element;
}

interface AppointmentDetailsGridProps {
  details: DetailItem[];
  class?: string;
}

export function AppointmentDetailsGrid(props: AppointmentDetailsGridProps) {
  return (
    <div class={`grid grid-cols-1 md:grid-cols-2 gap-4 ${props.class || ''}`}>
      {props.details.map((detail) => (
        <div class="space-y-2">
          <label class="text-sm font-medium text-muted-foreground">{detail.label}</label>
          <div class={`text-lg font-semibold text-primary ${
            detail.label === 'Sacred Exchange' ? 'text-2xl font-bold' : ''
          }`}>
            {detail.value}
          </div>
        </div>
      ))}
    </div>
  );
}
