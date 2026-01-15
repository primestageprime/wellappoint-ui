import { JSX, Show } from 'solid-js';
import { Mail, Phone, Briefcase } from '../icons';
import { CenteredContent } from '../base';
import { ProfilePic, MailLink, PhoneNumber, CenteredIconWithText, ProviderName, ProviderTitle } from './';
import { VerticallySpacedContent } from '../base';

interface ProviderContentProps {
  name: string;
  email?: string;
  phone?: string;
  title: string;
  profilePic?: string;
  class?: string;
}

/**
 * Validates email format
 */
function isValidEmail(email?: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number
 */
function isValidPhone(phone?: string): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 || (digits.length === 11 && digits[0] === '1');
}

export function ProviderContent(props: ProviderContentProps) {
  return (
    <CenteredContent class={props.class || ''}>
      <ProfilePic
        src={props.profilePic}
        alt={`${props.name}'s profile picture`}
      />

      <VerticallySpacedContent>
        <ProviderName>
          {props.name}
        </ProviderName>

        <CenteredIconWithText icon={<Briefcase />}>
          <ProviderTitle>
            {props.title}
          </ProviderTitle>
        </CenteredIconWithText>

        <Show when={isValidEmail(props.email)}>
          <CenteredIconWithText icon={<Mail />}>
            <MailLink email={props.email} />
          </CenteredIconWithText>
        </Show>

        <Show when={isValidPhone(props.phone)}>
          <CenteredIconWithText icon={<Phone />}>
            <PhoneNumber phone={props.phone} />
          </CenteredIconWithText>
        </Show>
      </VerticallySpacedContent>
    </CenteredContent>
  );
}
