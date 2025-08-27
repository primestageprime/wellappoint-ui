export interface AvailableSlot {
  startTime: string;
  endTime: string;
  durationMinutes: number;
  location: string;
  isOptimal: boolean;
}

export interface AvailabilityResponse {
  success: boolean;
  data?: AvailableSlot[];
  error?: string;
}

export async function getAvailableSlots(
  service: string,
  duration: number,
  email: string
): Promise<AvailableSlot[]> {
  try {
    console.log('getAvailableSlots called with:', { service, duration, email });
    
    // Validate inputs
    if (!service || !duration || !email) {
      throw new Error(`Missing required parameters: service=${service}, duration=${duration}, email=${email}`);
    }

    // Format dates as YYYY-MM-DD
    const today = new Date();
    const twoWeeksFromNow = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    };

    const params = new URLSearchParams({
      service: String(service),
      duration: String(duration),
      email: String(email),
      start: formatDate(today),
      end: formatDate(twoWeeksFromNow)
    });

    console.log('Making request to:', `/availability?${params}`);
    const response = await fetch(`/availability?${params}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Availability response error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Availability response:', data);
    return data as AvailableSlot[];
  } catch (error) {
    console.error('Failed to fetch available slots:', error);
    throw error;
  }
}
