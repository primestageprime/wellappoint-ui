import { JSX } from 'solid-js';

interface PageFrameProps {
  children: JSX.Element;
  class?: string;
}

export function PageFrame(props: PageFrameProps) {
  return (
    <div class={`w-full max-w-large mx-auto ${props.class || ''}`}>
      <div class="bg-card shadow-lg rounded-lg m-4 w-full max-w-large">
        {props.children}
      </div>
    </div>
  );
}
