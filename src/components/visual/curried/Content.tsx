import { JSX, Show, createSignal, createResource, createMemo } from 'solid-js';
import { LogOut, Settings } from 'lucide-solid';
import { WellAppointLogo } from '../icons';
import { CenteredContent } from '../base';
import { useAuth } from '../../../auth/AuthProvider';
import { apiFetch } from '../../../config/api';

interface ContentProps {
  children?: JSX.Element;
  class?: string;
}

async function fetchProviderUsernames(): Promise<string[]> {
  try {
    const response = await apiFetch('/api/providers');
    if (response.ok) {
      const data = await response.json();
      return data.usernames || [];
    }
  } catch (e) {
    console.warn('Failed to fetch provider usernames:', e);
  }
  return [];
}

export function Content(props: ContentProps) {
  const auth = useAuth();
  const [providerUsernames] = createResource(fetchProviderUsernames);

  // Check if the user's email prefix or nickname matches a provider username
  const matchingProvider = createMemo(() => {
    const usernames = providerUsernames() || [];
    const user = auth.user();
    if (!user || usernames.length === 0) return null;

    // Check email prefix (e.g., "peter.stradinger" from "peter.stradinger@gmail.com")
    const emailPrefix = user.email?.split('@')[0];
    if (emailPrefix && usernames.includes(emailPrefix)) {
      return emailPrefix;
    }

    // Check nickname
    if (user.nickname && usernames.includes(user.nickname)) {
      return user.nickname;
    }

    // Check for partial matches (username starts with email prefix)
    if (emailPrefix) {
      const partialMatch = usernames.find(u => u.startsWith(emailPrefix));
      if (partialMatch) return partialMatch;
    }

    return null;
  });

  return (
    <div class={`bg-white p-3 ${props.class || ''}`}>
      {/* Header with logo */}
      <div class="relative">
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
