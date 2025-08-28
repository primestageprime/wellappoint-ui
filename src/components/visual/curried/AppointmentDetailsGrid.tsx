import { JSX } from 'solid-js';
import { IconWithText, SmallText, VerticallySpacedContent } from '../base';
import { Calendar, Globe, Currency } from '../icons';
import { Clock } from 'lucide-solid';

interface DetailItem {
  label: string;
  value: string | JSX.Element;
  icon: JSX.Element;
}

interface AppointmentDetailsGridProps {
  details: DetailItem[];
  class?: string;
}

export function AppointmentDetailsGrid(props: AppointmentDetailsGridProps) {
  return (
    <div class={`grid grid-cols-1 md:grid-cols-2 gap-4 ${props.class || ''}`}>
      {props.details.map((detail) => (
        <VerticallySpacedContent>
          <IconWithText icon={detail.icon}>{detail.label}</IconWithText>
          <div class={`text-lg font-semibold ${
            detail.label === 'Sacred Exchange' ? 'text-2xl font-bold text-primary' : 'text-foreground'
          }`}>
            {detail.value}
          </div>
        </VerticallySpacedContent>
      ))}
    </div>
  );
}
