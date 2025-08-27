import { JSX } from 'solid-js';
import { User as UserIcon } from 'lucide-solid';

interface UserProps {
  class?: string;
}

export function User(props: UserProps) {
  return (
    <UserIcon class={`w-6 h-6 text-primary-foreground ${props.class || ''}`} />
  );
}
