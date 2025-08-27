import { JSX } from 'solid-js';

interface SmallTextProps {
  children: JSX.Element;
  class?: string;
}

export function SmallText(props: SmallTextProps) {
  return (
    <span class={`text-sm text-primary ${props.class || ''}`}>
      {props.children}
    </span>
  );
}
