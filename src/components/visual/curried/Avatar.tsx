import { Show } from 'solid-js';
import { User as UserIcon } from 'lucide-solid';

interface AvatarProps {
  username: () => string;
  class?: string;
}

export function Avatar(props: AvatarProps) {
  return (
    <Show when={props.username()}>
      <div class={`pt-6 pb-6 pl-3 pr-6 flex items-center gap-4 ${props.class || ''}`}>
        {/* User Icon Circle */}
        <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
          <UserIcon class="w-6 h-6 text-primary-foreground" />
        </div>
        
        {/* Welcome Message and Name */}
        <div class="flex flex-col">
          <span class="text-sm text-muted-foreground">Welcome back,</span>
          <span class="text-sm font-semibold text-primary">@{props.username()}</span>
        </div>
      </div>
    </Show>
  );
}
