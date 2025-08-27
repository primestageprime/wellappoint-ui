import { JSX } from 'solid-js';
import { Mail, Briefcase } from './icons';
import { CenteredContent } from './CenteredContent';
import { ProfilePic } from './ProfilePic';
import { MailLink } from './MailLink';
import { CenteredIconWithText } from './CenteredIconWithText';
import { ProviderName } from './ProviderName';
import { ProviderTitle } from './ProviderTitle';
import { VerticallySpacedContent } from './VerticallySpacedContent';

interface ProviderContentProps {
  name: string;
  email: string;
  title: string;
  profilePic?: string;
  class?: string;
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
        
        <CenteredIconWithText icon={<Mail />}>
          <MailLink email={props.email}>
            {props.email}
          </MailLink>
        </CenteredIconWithText>
      </VerticallySpacedContent>
    </CenteredContent>
  );
}
