import { createResource } from 'solid-js';
import { getProviderDetails } from '../services/providerService';

export function useProvider() {
  const [providerDetails] = createResource(() => getProviderDetails());

  return {
    providerDetails,
  };
}
