import { JSX } from 'solid-js';

interface ProviderTitleProps {
  children: JSX.Element;
  class?: string;
}

export function ProviderTitle(props: ProviderTitleProps) {
  return (
    <span class={`text-sm font-medium text-muted-foreground ${props.class || ''}`}>
      {props.children}
    </span>
  );
}
