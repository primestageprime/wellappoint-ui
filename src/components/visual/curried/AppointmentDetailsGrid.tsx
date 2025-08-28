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
    <VerticallySpacedContent>
      {props.details.map((detail) => (
        <div>
          <IconWithText icon={detail.icon}>{detail.label}</IconWithText>
          <SmallText>{detail.value}</SmallText>
        </div>
      ))}
    </VerticallySpacedContent>
  );
}
