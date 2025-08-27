import { JSX } from 'solid-js';

interface PaddingSpacerProps {
  children: JSX.Element;
  class?: string;
}

export function PaddingSpacer(props: PaddingSpacerProps) {
  return (
    <div class={`p-6 space-y-4 ${props.class || ''}`}>
      {props.children}
    </div>
  );
}
