import { JSX } from 'solid-js';

interface ProviderNameProps {
  children: JSX.Element;
  class?: string;
}

export function ProviderName(props: ProviderNameProps) {
  return (
    <h3 class={`text-xl font-semibold text-primary ${props.class || ''}`}>
      {props.children}
    </h3>
  );
}
