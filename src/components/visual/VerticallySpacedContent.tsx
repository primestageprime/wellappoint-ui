import { JSX } from 'solid-js';

interface VerticallySpacedContentProps {
  children: JSX.Element;
  class?: string;
}

export function VerticallySpacedContent(props: VerticallySpacedContentProps) {
  return (
    <div class={`space-y-2 ${props.class || ''}`}>
      {props.children}
    </div>
  );
}
