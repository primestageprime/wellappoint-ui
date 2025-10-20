import { JSX } from 'solid-js';
import { IconWithTitleAndSubtitle } from '../base/IconWithTitleAndSubtitle';
import { X } from 'lucide-solid';

interface ServiceSummaryCardProps {
  icon: JSX.Element;
  title: string;
  subtitle: string;
  class?: string;
  onEdit?: () => void;
}

export function ServiceSummaryCard(props: ServiceSummaryCardProps) {
  return (
    <button
      onClick={props.onEdit}
      disabled={!props.onEdit}
      class={`w-full p-4 bg-card rounded-lg border-2 border-primary/30 hover:border-primary/50 transition-colors cursor-pointer flex items-center justify-between ${props.class || ''} ${!props.onEdit ? 'cursor-default' : ''}`}
    >
      <IconWithTitleAndSubtitle
        icon={props.icon}
        title={props.title}
        subtitle={props.subtitle}
      />
      {props.onEdit && (
        <X class="w-5 h-5 text-primary" />
      )}
    </button>
  );
}
