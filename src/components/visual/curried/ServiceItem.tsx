import { JSX } from 'solid-js';
import { IconWithTitleAndSubtitle } from '../base/IconWithTitleAndSubtitle';
import { ChevronRight } from '../icons';

interface ServiceItemProps {
  name: string;
  description: string;
  icon?: JSX.Element;
  onClick?: () => void;
  class?: string;
}

export function ServiceItem(props: ServiceItemProps) {
  const handleClick = () => {
    console.log('ServiceItem clicked:', props.name);
    if (props.onClick) {
      props.onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      class={`w-full p-4 bg-card rounded-lg border border-primary/10 hover:border-primary/20 transition-colors cursor-pointer flex items-center justify-between ${props.class || ''}`}
    >
      <IconWithTitleAndSubtitle
        icon={props.icon}
        title={props.name}
        subtitle={props.description}
      />
      <ChevronRight class="w-5 h-5 text-primary" />
    </button>
  );
}
