import { JSX } from 'solid-js';

interface StandardButtonProps {
  children: JSX.Element;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  class?: string;
}

export function StandardButton(props: StandardButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/20';
  
  const variantClasses = {
    primary: 'bg-muted text-primary hover:bg-primary/10',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-primary/20 text-primary hover:bg-primary/5'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };
  
  const classes = [
    baseClasses,
    variantClasses[props.variant || 'primary'],
    sizeClasses[props.size || 'md'],
    props.class || ''
  ].join(' ');
  
  return (
    <button
      type={props.type || 'button'}
      onClick={props.onClick}
      disabled={props.disabled}
      class={classes}
    >
      {props.children}
    </button>
  );
}
