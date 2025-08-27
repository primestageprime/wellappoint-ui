import { JSX } from 'solid-js';

interface CenteredContentProps {
  children: JSX.Element;
  class?: string;
}

export function CenteredContent(props: CenteredContentProps) {
  return (
    <div class={`flex flex-col items-center text-center ${props.class || ''}`}>
      {props.children}
    </div>
  );
}
