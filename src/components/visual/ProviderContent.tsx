import { JSX } from 'solid-js';
import { IconWithText } from './IconWithText';
import { Mail, Briefcase } from './icons';
import { CenteredContent } from './CenteredContent';
import { ProfilePic } from './ProfilePic';
import { MailLink } from './MailLink';

interface ProviderContentProps {
  name: string;
  email: string;
  title: string;
  profilePic?: string;
  class?: string;
}

export function ProviderContent(props: ProviderContentProps) {
  return (
    <CenteredContent class={`p-6 ${props.class || ''}`}>
      <ProfilePic 
        src={props.profilePic} 
        alt={`${props.name}'s profile picture`}
      />
      
      <div class="space-y-2">
        <h3 class="text-xl font-semibold text-primary">
          {props.name}
        </h3>
        
        <IconWithText icon={<Briefcase />} class="justify-center">
          <span class="text-sm font-medium text-muted-foreground">
            {props.title}
          </span>
        </IconWithText>
        
        <IconWithText icon={<Mail />} class="justify-center">
          <MailLink email={props.email}>
            {props.email}
          </MailLink>
        </IconWithText>
      </div>
    </CenteredContent>
  );
}
