import { JSX } from 'solid-js';

interface ErrorMessageProps {
  children: JSX.Element;
}

export function ErrorMessage(props: ErrorMessageProps) {
  return (
    <div class="max-w-3xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
      {props.children}
    </div>
  );
}

