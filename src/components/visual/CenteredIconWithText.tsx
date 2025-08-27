import { JSX } from 'solid-js';

interface CenteredIconWithTextProps {
  icon: JSX.Element;
  children: JSX.Element;
  class?: string;
}

export function CenteredIconWithText(props: CenteredIconWithTextProps) {
  return (
    <div class={`flex items-center justify-center gap-2 ${props.class || ''}`}>
      {props.icon}
      {props.children}
    </div>
  );
}
