import { JSX } from 'solid-js';

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  children: JSX.Element;
}

export function ActionButton(props: ActionButtonProps) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled || props.isLoading}
      class="px-4 py-2 bg-[#8B6914] text-white rounded-md hover:bg-[#6d5410] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {props.isLoading ? props.loadingText : props.children}
    </button>
  );
}

