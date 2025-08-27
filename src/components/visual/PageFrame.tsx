import { JSX } from 'solid-js';

interface PageFrameProps {
  children: JSX.Element;
  class?: string;
}

export function PageFrame(props: PageFrameProps) {
  return (
    <div class={`bg-card shadow-lg rounded-lg m-4 ${props.class || ''}`}>
      {props.children}
    </div>
  );
}
