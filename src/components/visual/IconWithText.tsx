import { JSX } from 'solid-js';

interface IconWithTextProps {
  icon: JSX.Element;
  children: JSX.Element;
  class?: string;
}

export function IconWithText(props: IconWithTextProps) {
  return (
    <div class={`flex items-center gap-2 ${props.class || ''}`}>
      {props.icon}
      {props.children}
    </div>
  );
}
