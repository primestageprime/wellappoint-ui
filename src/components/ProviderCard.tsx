import { createResource } from 'solid-js';
import { Provider } from '../types/provider';
import { getProviderDetails } from '../services/providerService';
import { Card } from './Card';

export function ProviderCard() {
  const [provider, { mutate, refetch }] = createResource<Provider | null>(getProviderDetails);

  return (
    <Card className="mb-6">
      <div class="px-4 py-5 sm:p-6">
        {provider.loading && (
          <div class="text-center text-muted-foreground mb-2">Loading provider...</div>
        )}
        
        {provider.error && (
          <div class="text-center">
            <div class="text-muted-foreground text-sm">Provider not available</div>
          </div>
        )}
        
        {provider() && (
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <span class="text-2xl font-semibold text-primary">
                {provider()!.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-card-foreground mb-1">
                {provider()!.name}
              </h3>
              <p class="text-sm text-muted-foreground mb-1">
                {provider()!.email}
              </p>
              <p class="text-sm text-primary font-medium">
                {provider()!.title}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
