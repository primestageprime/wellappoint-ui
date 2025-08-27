import { JSX } from 'solid-js';
import { Mail, Briefcase } from '../icons';
import { CenteredContent } from '../base';
import { ProfilePic, MailLink, CenteredIconWithText, ProviderName, ProviderTitle } from './';
import { VerticallySpacedContent } from '../base';

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
