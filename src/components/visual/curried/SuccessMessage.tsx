import { JSX } from 'solid-js';

interface SuccessMessageProps {
  children: JSX.Element;
  inline?: boolean;
}

export function SuccessMessage(props: SuccessMessageProps) {
  const baseClass = "p-3 bg-green-50 border border-green-200 rounded-md";
  const wrapperClass = props.inline ? baseClass : `max-w-3xl mx-auto mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg`;
  
  return (
    <div class={wrapperClass}>
      <p class="text-sm text-green-800">
        {props.children}
      </p>
    </div>
  );
}

