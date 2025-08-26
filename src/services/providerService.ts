import { Provider } from '../types/provider';

export async function getProviderDetails(): Promise<Provider | null> {
  try {
    const response = await fetch('/api/provider');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data as Provider;
  } catch (error) {
    console.error('Failed to fetch provider details:', error);
    return null;
  }
}
