import { JSX, Show } from 'solid-js';

interface PhoneNumberProps {
  phone?: string;
  children?: JSX.Element;
  class?: string;
}

/**
 * Formats a phone number to (xxx) xxx-xxxx format
 * Extracts only numeric characters from input
 */
function formatPhoneNumber(phone: string): string | null {
  // Extract only numeric characters
  const digits = phone.replace(/\D/g, '');

  // Check if we have a valid 10-digit US phone number
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // Check if we have 11 digits (with country code 1)
  if (digits.length === 11 && digits[0] === '1') {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  // Invalid phone number
  return null;
}

/**
 * Gets the tel: link format (digits only)
 */
function getTelLink(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return `tel:${digits}`;
}

/**
 * Checks if a phone number is valid
 */
function isValidPhone(phone?: string): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 || (digits.length === 11 && digits[0] === '1');
}

export function PhoneNumber(props: PhoneNumberProps) {
  // Don't render anything if phone is invalid
  const validPhone = () => isValidPhone(props.phone);
  const formattedPhone = () => props.phone ? formatPhoneNumber(props.phone) : null;

  return (
    <Show when={validPhone() && formattedPhone()}>
      <a
        href={getTelLink(props.phone!)}
        class={`text-sm text-primary hover:text-primary/80 transition-colors ${props.class || ''}`}
      >
        {formattedPhone()}
      </a>
    </Show>
  );
}
