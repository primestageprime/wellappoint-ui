import { JSX } from 'solid-js';
import { User as UserIcon } from 'lucide-solid';

interface ProfilePicProps {
  src?: string;
  alt: string;
  class?: string;
}

export function ProfilePic(props: ProfilePicProps) {
  return (
    <div class={`mb-4 ${props.class || ''}`}>
      {props.src ? (
        <img 
          src={props.src} 
          alt={props.alt}
          class="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
        />
      ) : (
        <div class="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
          <UserIcon class="w-10 h-10 text-primary-foreground" />
        </div>
      )}
    </div>
  );
}
