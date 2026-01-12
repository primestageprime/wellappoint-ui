import { JSX } from 'solid-js';

interface DangerButtonProps {
  children: JSX.Element;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function DangerButton(props: DangerButtonProps) {
  return (
    <button
      type={props.type || 'button'}
      disabled={props.disabled}
      onClick={props.onClick}
      style={{
        "background-color": props.disabled ? "#9ca3af" : "#dc2626",
        "color": "white",
        "padding": "8px 16px",
        "border-radius": "4px",
        "border": "none",
        "cursor": props.disabled ? "not-allowed" : "pointer",
        "font-size": "14px",
        "font-weight": "600",
        "opacity": props.disabled ? "0.5" : "1",
      }}
      onMouseEnter={(e) => {
        if (!props.disabled) {
          e.currentTarget.style.backgroundColor = "#b91c1c";
        }
      }}
      onMouseLeave={(e) => {
        if (!props.disabled) {
          e.currentTarget.style.backgroundColor = "#dc2626";
        }
      }}
    >
      {props.children}
    </button>
  );
}
