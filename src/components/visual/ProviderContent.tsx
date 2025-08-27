import { JSX } from 'solid-js';
import { User, Mail, Briefcase } from 'lucide-solid';

interface ProviderContentProps {
  name: string;
  email: string;
  title: string;
  profilePic?: string;
  class?: string;
}

export function ProviderContent(props: ProviderContentProps) {
  return (
    <div class={`flex flex-col items-center text-center p-6 ${props.class || ''}`}>
      {/* Profile Picture */}
      <div class="mb-4">
        {props.profilePic ? (
          <img 
            src={props.profilePic} 
            alt={`${props.name}'s profile picture`}
            class="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
          />
        ) : (
          <div class="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
            <User class="w-10 h-10 text-primary-foreground" />
          </div>
        )}
      </div>
      
      {/* Provider Information */}
      <div class="space-y-2">
        {/* Name */}
        <h3 class="text-xl font-semibold text-primary">
          {props.name}
        </h3>
        
        {/* Title */}
        <div class="flex items-center justify-center gap-4">
          <Briefcase class="w-4 h-4 text-muted-foreground" />
          <span class="text-sm font-medium text-muted-foreground">
            {props.title}
          </span>
        </div>
        
        {/* Email */}
        <div class="flex items-center justify-center gap-4">
          <Mail class="w-4 h-4 text-muted-foreground" />
          <a 
            href={`mailto:${props.email}`}
            class="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            {props.email}
          </a>
        </div>
      </div>
    </div>
  );
}
