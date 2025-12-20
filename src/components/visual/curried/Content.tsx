import { JSX, Show } from 'solid-js';
import { LogOut } from 'lucide-solid';
import { WellAppointLogo } from '../icons';
import { CenteredContent } from '../base';
import { useAuth } from '../../../auth/AuthProvider';

interface ContentProps {
  children?: JSX.Element;
  class?: string;
}

export function Content(props: ContentProps) {
  const auth = useAuth();

  return (
    <div class={`bg-white p-3 ${props.class || ''}`}>
      {/* Header with logo and logout */}
      <div class="relative">
        {/* Logout button - top right */}
        <Show when={auth.isAuthenticated()}>
          <button
            onClick={() => auth.logout()}
            class="absolute top-0 right-0 flex items-center gap-1 text-sm text-[#8B6914] hover:text-[#6d5410] transition-colors"
            aria-label="Logout"
          >
            <LogOut size={16} />
            <span class="hidden sm:inline">Logout</span>
          </button>
        </Show>
        
        {/* Centered logo and title */}
        <CenteredContent>
          <a href="/" class="flex flex-col items-center no-underline">
            {/* Well Logo */}
            <WellAppointLogo className="text-primary" size={48} />
            {/* Company Name */}
            <h1 class="text-lg font-bold text-primary">WellAppoint</h1>
          </a>
        </CenteredContent>
      </div>
      
      <div class="space-y-4 mt-4">
        {props.children}
      </div>
    </div>
  );
}
