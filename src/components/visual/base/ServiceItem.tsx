import { JSX } from 'solid-js';
import { IconWithTitleAndSubtitle } from './IconWithTitleAndSubtitle';

interface ServiceItemProps {
  name: string;
  description: string;
  icon?: JSX.Element;
  class?: string;
}

export function ServiceItem(props: ServiceItemProps) {
  return (
    <div class={`p-4 bg-card rounded-lg border border-primary/10 hover:border-primary/20 transition-colors cursor-pointer ${props.class || ''}`}>
      <IconWithTitleAndSubtitle
        icon={props.icon}
        title={props.name}
        subtitle={props.description}
      />
    </div>
  );
}
