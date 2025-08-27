import { JSX } from 'solid-js';

interface SectionHeadingProps {
  children: JSX.Element;
  class?: string;
}

export function SectionHeading(props: SectionHeadingProps) {
  return (
    <h3 class={`text-lg font-medium text-primary mb-2 ${props.class || ''}`}>
      {props.children}
    </h3>
  );
}
