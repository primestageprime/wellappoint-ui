import { JSX } from 'solid-js';

interface MailLinkProps {
  email: string;
  children: JSX.Element;
  class?: string;
}

export function MailLink(props: MailLinkProps) {
  return (
    <a 
      href={`mailto:${props.email}`}
      class={`text-sm text-primary hover:text-primary/80 transition-colors ${props.class || ''}`}
    >
      {props.children}
    </a>
  );
}
