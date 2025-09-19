import { JSX } from 'solid-js';

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  class?: string;
  onInput?: (event: Event & { currentTarget: HTMLInputElement }) => void;
  onChange?: (event: Event & { currentTarget: HTMLInputElement }) => void;
  onBlur?: (event: Event & { currentTarget: HTMLInputElement }) => void;
  onFocus?: (event: Event & { currentTarget: HTMLInputElement }) => void;
}

export function Input(props: InputProps): JSX.Element {
  return (
    <input
      type={props.type || 'text'}
      value={props.value || ''}
      placeholder={props.placeholder}
      required={props.required}
      disabled={props.disabled}
      class={`px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${props.class || ''}`}
      onInput={props.onInput}
      onChange={props.onChange}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
    />
  );
}
