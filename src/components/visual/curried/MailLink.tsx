import { JSX, Show } from 'solid-js';

interface MailLinkProps {
  email?: string;
  children?: JSX.Element;
  class?: string;
}

/**
 * Validates email format using a simple regex
 */
function isValidEmail(email?: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function MailLink(props: MailLinkProps) {
  // Don't render anything if email is invalid
  const validEmail = () => isValidEmail(props.email);

  return (
    <Show when={validEmail()}>
      <a
        href={`mailto:${props.email}`}
        class={`text-sm text-primary hover:text-primary/80 transition-colors ${props.class || ''}`}
      >
        {props.children || props.email}
      </a>
    </Show>
  );
}
