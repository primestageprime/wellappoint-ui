import { createSignal, createEffect } from 'solid-js';
import { Provider } from '../types/provider';
import { getProviderDetails, fallbackProvider } from '../services/providerService';

export function ProviderCard() {
  const [provider, setProvider] = createSignal<Provider | null>(null);
  const [loading, setLoading] = createSignal(true);

  createEffect(async () => {
    try {
      setLoading(true);
      console.log('Fetching provider details...');
      const providerData = await getProviderDetails();
      console.log('Provider data received:', providerData);
      setProvider(providerData || fallbackProvider);
    } catch (error) {
      console.error('Failed to load provider details:', error);
      setProvider(fallbackProvider);
    } finally {
      setLoading(false);
    }
  });

  if (loading()) {
    return (
      <div class="bg-card rounded-lg p-6 mb-6 shadow-sm border border-border/20">
        <div class="text-center text-muted-foreground mb-2">Loading provider...</div>
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-muted rounded-full animate-pulse"></div>
          <div class="flex-1">
            <div class="h-4 bg-muted rounded animate-pulse mb-2"></div>
            <div class="h-3 bg-muted rounded animate-pulse mb-1"></div>
            <div class="h-3 bg-muted rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  const providerData = provider();
  if (!providerData) return null;

  return (
    <div class="bg-card rounded-lg p-6 mb-6 shadow-sm border border-border/20">
      <div class="flex items-center space-x-4">
        <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <span class="text-2xl font-semibold text-primary">
            {providerData.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-card-foreground mb-1">
            {providerData.name}
          </h3>
          <p class="text-sm text-muted-foreground mb-1">
            {providerData.email}
          </p>
          <p class="text-sm text-primary font-medium">
            {providerData.title}
          </p>
        </div>
      </div>
    </div>
  );
}
