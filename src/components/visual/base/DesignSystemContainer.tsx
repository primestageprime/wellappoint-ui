import { JSX } from 'solid-js';

interface DesignSystemContainerProps {
  children: JSX.Element;
  class?: string;
}

export function DesignSystemContainer(props: DesignSystemContainerProps) {
  return (
    <div class={`bg-muted p-4 rounded-lg ${props.class || ''}`}>
      {props.children}
    </div>
  );
}
