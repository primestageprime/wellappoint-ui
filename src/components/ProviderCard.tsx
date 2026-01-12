import { createResource } from 'solid-js';
import { A } from '@solidjs/router';
import { Provider } from '../types/provider';
import { getProviderDetails } from '../services/providerService';

interface ProviderCardProps {
  username: string;
}

export function ProviderCard(props: ProviderCardProps) {
  const [provider] = createResource<Provider | null>(
    () => props.username,
    (username) => getProviderDetails(username)
  );

  return (
    <div class="mb-8">
      {/* Provider Information */}
      {provider.loading && (
        <div class="text-center text-muted-foreground mb-2">Loading provider...</div>
      )}

      {provider.error && (
        <div class="text-center">
          <div class="text-muted-foreground text-sm">Provider not available</div>
        </div>
      )}

      {provider() && (
        <div class="flex items-center justify-center space-x-4 py-4">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-2xl font-semibold text-primary">
              {provider()!.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div class="text-left">
            <h2 class="text-lg font-semibold text-card-foreground mb-1">
              {provider()!.name}
            </h2>
            <p class="text-sm text-muted-foreground">
              {provider()!.title}
            </p>
            <p class="text-sm text-muted-foreground">
              {provider()!.phone}
            </p>
            <p class="text-sm text-muted-foreground">
              {provider()!.email}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
