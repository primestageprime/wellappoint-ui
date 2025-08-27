import { JSX } from 'solid-js';

interface IconWithTitleAndSubtitleProps {
  icon: JSX.Element;
  title: string;
  subtitle: string;
  onClick?: () => void;
  class?: string;
}

export function IconWithTitleAndSubtitle(props: IconWithTitleAndSubtitleProps) {
  const content = (
    <>
      {props.icon}
      <div class="flex flex-col">
        <span class="font-medium text-primary text-left">{props.title}</span>
        <span class="text-sm text-left">{props.subtitle}</span>
      </div>
    </>
  );

  if (props.onClick) {
    return (
      <button
        onClick={props.onClick}
        class={`flex items-center gap-2 cursor-pointer hover:bg-primary/5 transition-colors rounded p-2 ${props.class || ''}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div class={`flex items-center gap-2 ${props.class || ''}`}>
      {content}
    </div>
  );
}
  