import { createSignal, createEffect } from 'solid-js';
import { type BookingService } from '../types/service';
import { annotateOnClick } from '../utils/serviceUtils';

export function useServices(username: () => string, onServiceSelect?: (serviceName: string) => void) {
  const [services, setServices] = createSignal<BookingService[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  const fetchServices = async () => {
    try {
      console.log('🔍 fetchServices called for username:', username());
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/services?username=${username()}`);
      console.log('🔍 Services response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🔍 Services data:', data);
      
      // Annotate services with onClick handlers if callback is provided
      const annotatedServices = onServiceSelect 
        ? annotateOnClick(onServiceSelect, data)
        : data;
      
      setServices(annotatedServices);
      console.log('🔍 Services set, setting loading to false');
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
      console.log('🔍 Loading set to false');
    }
  };

  // Auto-fetch services when username changes
  createEffect(() => {
    const currentUsername = username();
    console.log('🔍 createEffect - username:', currentUsername);
    if (currentUsername) {
      fetchServices();
    }
  });

  return {
    services,
    loading,
    error,
    refetch: fetchServices,
  };
}
