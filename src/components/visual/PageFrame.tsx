import { JSX } from 'solid-js';

interface PageFrameProps {
  children: JSX.Element;
  class?: string;
}

export function PageFrame(props: PageFrameProps) {
  return (
    <div class={`bg-card shadow-lg rounded-lg mx-auto my-4 ${props.class || ''}`}>
      {props.children}
    </div>
  );
}
