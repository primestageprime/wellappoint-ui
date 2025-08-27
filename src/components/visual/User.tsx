import { JSX } from 'solid-js';
import { User } from 'lucide-solid';

interface AvatarProps {
  name: string;
  class?: string;
}

export function Avatar(props: AvatarProps) {
  return (
    <div class={`flex items-center gap-3 ${props.class || ''}`}>
      {/* User Icon Circle */}
      <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
        <User class="w-5 h-5 text-primary-foreground" />
      </div>
      
      {/* Welcome Message and Name */}
      <div class="flex flex-col">
        <span class="text-sm text-muted-foreground">Welcome back,</span>
        <span class="text-lg font-semibold text-primary">{props.name}</span>
      </div>
    </div>
  );
}
