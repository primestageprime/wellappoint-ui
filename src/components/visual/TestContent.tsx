import { JSX } from 'solid-js';

interface TestContentProps {
  header?: string;
  children?: JSX.Element;
  class?: string;
}

export function TestContent(props: TestContentProps) {
  if (props.header) {
    return (
      <div class={`p-6 ${props.class || ''}`}>
        <h3 class="text-lg font-medium text-primary mb-2">{props.header}</h3>
        {props.children}
      </div>
    );
  }

  return (
    <div class={`p-6 ${props.class || ''}`}>
      <p class="text-muted-foreground leading-6">
        {props.children}
      </p>
    </div>
  );
}
