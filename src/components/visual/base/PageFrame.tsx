import { JSX } from "solid-js";

interface PageFrameProps {
  children: JSX.Element;
  class?: string;
  wide?: boolean;
}

export function PageFrame(props: PageFrameProps) {
  const maxWidthClass = props.wide ? 'max-w-screen-xl' : 'max-w-large';
  
  return (
    <div class={`w-full ${maxWidthClass} mx-auto ${props.class || ""}`}>
      <div class={`bg-card shadow-lg rounded-lg w-full ${maxWidthClass}`}>
        {props.children}
      </div>
    </div>
  );
}
