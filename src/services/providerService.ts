import { Provider } from '../types/provider';

export async function getProviderDetails(): Promise<Provider | null> {
  try {
    // Try the backend API first
    const response = await fetch('/api/provider');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch provider details from API, using fallback:', error);
    return null;
  }
}

// Fallback provider data if API is not available
export const fallbackProvider: Provider = {
  name: "Samara Jade",
  email: "samara@wellappoint.com",
  title: "Holistic Wellness Practitioner",
  bio: "Dedicated to providing personalized wellness experiences through therapeutic massage, craniosacral therapy, and reflexology.",
  specialties: ["Therapeutic Massage", "Craniosacral Therapy", "Foot Reflexology"]
};
