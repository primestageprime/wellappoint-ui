import { JSX } from 'solid-js';

interface ButtonProps {
  children: JSX.Element;
  onClick?: () => void;
  icon?: JSX.Element;
  class?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

export function Button(props: ButtonProps) {
  return (
    <button
      type={props.type || 'button'}
      onClick={props.onClick}
      disabled={props.disabled}
      class={`flex items-center gap-3 px-1 py-0.5 rounded text-sm font-medium transition-all duration-200 border-0 bg-transparent hover:outline hover:outline-1 hover:outline-primary/20 focus:outline focus:outline-1 focus:outline-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mx-4 my-2 ${props.class || ''}`}
      aria-label={props['aria-label']}
    >
      {props.icon}
      {props.children}
    </button>
  );
}
