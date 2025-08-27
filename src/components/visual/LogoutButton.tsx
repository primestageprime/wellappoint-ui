import { JSX } from 'solid-js';
import { LogOut } from 'lucide-solid';
import { Button } from './Button';

interface LogoutButtonProps {
  onLogout: () => void;
  children?: JSX.Element;
  class?: string;
}

export function LogoutButton(props: LogoutButtonProps) {
  return (
    <Button
      onClick={props.onLogout}
      icon={<LogOut class="w-4 h-4" />}
      class={`text-primary hover:text-primary/80 hover:bg-primary/10 ${props.class || ''}`}
      aria-label="Logout from account"
    >
      {props.children || 'Logout'}
    </Button>
  );
}
