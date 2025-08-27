import { JSX } from 'solid-js';

interface IconWithTitleAndSubtitleProps {
  icon: JSX.Element;
  title: string;
  subtitle: string;
  class?: string;
}

export function IconWithTitleAndSubtitle(props: IconWithTitleAndSubtitleProps) {
  return (
    <div class={`flex items-center gap-2 ${props.class || ''}`}>
      {props.icon}
      <div class="flex flex-col">
        <span class="font-medium text-primary">{props.title}</span>
        <span class="text-sm">{props.subtitle}</span>
      </div>
    </div>
  );
}
