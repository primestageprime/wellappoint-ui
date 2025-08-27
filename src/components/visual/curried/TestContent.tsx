import { JSX } from 'solid-js';
import { SectionHeading } from '../base';

interface TestContentProps {
  header?: string;
  children?: JSX.Element;
  class?: string;
}

export function TestContent(props: TestContentProps) {
  if (props.header) {
    return (
      <div class={`p-6 ${props.class || ''}`}>
        <SectionHeading>{props.header}</SectionHeading>
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
