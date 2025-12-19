import { Accessor, Setter } from 'solid-js';

interface FormFieldProps {
  label: string;
  name: string;
  placeholder: string;
  value: Accessor<string>;
  onInput: Setter<string>;
  helpText?: string;
  disabled?: boolean;
  required?: boolean;
}

export function FormField(props: FormFieldProps) {
  return (
    <div>
      <label for={props.name} class="block text-sm font-medium text-[#5a4510] mb-2">
        {props.label}
      </label>
      <input
        id={props.name}
        type="text"
        value={props.value()}
        onInput={(e) => props.onInput(e.currentTarget.value)}
        placeholder={props.placeholder}
        required={props.required ?? true}
        disabled={props.disabled}
        class="w-full h-10 px-4 border border-[#8B6914]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B6914] focus:border-transparent bg-white text-[#3d2e0a] placeholder:text-[#8B6914]/50 disabled:bg-[#f5f0e6] disabled:text-[#8B6914]/60"
      />
      {props.helpText && (
        <p class="text-xs text-[#8B6914]/70 mt-1">
          {props.helpText}
        </p>
      )}
    </div>
  );
}

