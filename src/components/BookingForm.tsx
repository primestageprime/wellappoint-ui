import { createSignal, createEffect, For, Show } from 'solid-js';
import { Clock } from 'lucide-solid';
import { useAuth } from '../auth/AuthProvider';

interface AvailabilityRequest {
  duration: number;
  service: string;
  email: string;
  location: string;
  start: string; // "YYYY-MM-DD" format
  end: string;   // "YYYY-MM-DD" format
}

interface AvailableSlot {
  startTime: string;
  endTime: string;
  durationMinutes: number;
  location: string;
  isOptimal: boolean;
}

interface AvailabilityResponse {
  availableSlots: AvailableSlot[];
  totalSlots: number;
  optimalSlots: number;
  dateRange: {
    start: string;
    end: string;
  };
}

import { type BookingService } from '../types/service';

interface BookingFormProps {
  services: BookingService[];
}

export function BookingForm(props: BookingFormProps) {
  const auth = useAuth();
  const [selectedService, setSelectedService] = createSignal<string>('');
  const [selectedDuration, setSelectedDuration] = createSignal<number>(0);
  const [availableDurations, setAvailableDurations] = createSignal<number[]>([]);
  const [selectedPrice, setSelectedPrice] = createSignal<number>(0);
  const [availabilityResponse, setAvailabilityResponse] = createSignal<AvailableSlot[] | null>(null);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [selectedSlot, setSelectedSlot] = createSignal<AvailableSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = createSignal<boolean>(false);
  const [submitMessage, setSubmitMessage] = createSignal<string>('');

  // Get unique services and their durations
  const uniqueServices = () => {
    const serviceMap = new Map<string, { durations: number[], minPrice: number }>();
    
    props.services.forEach(service => {
      if (!serviceMap.has(service.name)) {
        serviceMap.set(service.name, { durations: [], minPrice: service.price });
      }
      const existing = serviceMap.get(service.name)!;
      existing.durations.push(service.duration);
      if (service.price < existing.minPrice) {
        existing.minPrice = service.price;
      }
    });
    
    return Array.from(serviceMap.entries()).map(([name, data]) => ({
      name,
      durations: data.durations.sort((a, b) => a - b),
      minPrice: data.minPrice
    }));
  };

  // Set the selected service when component mounts
  createEffect(() => {
    if (props.services.length > 0 && !selectedService()) {
      const serviceName = props.services[0].name;
      console.log('Setting selected service:', serviceName);
      setSelectedService(serviceName);
    }
  });

  // Update available durations when service changes
  createEffect(() => {
    const service = uniqueServices().find(s => s.name === selectedService());
    if (service) {
      console.log('Setting available durations for service:', selectedService(), 'durations:', service.durations);
      setAvailableDurations(service.durations);
      // Reset duration selection
      setSelectedDuration(0);
      setSelectedPrice(0);
    }
  });

  // Update price when service and duration are selected
  createEffect(() => {
    if (selectedService() && selectedDuration() > 0) {
      const matchingService = props.services.find(
        s => s.name === selectedService() && s.duration === selectedDuration()
      );
      if (matchingService) {
        setSelectedPrice(matchingService.price);
      }
    }
  });

  // Function to fetch availability
  const fetchAvailability = async () => {
    if (!selectedService() || !selectedDuration()) {
      return;
    }

    setIsLoading(true);
    setAvailabilityResponse(null);

    try {
      // Calculate date range for next 2 weeks
      const today = new Date();
      const now = new Date();
      
      // Start from today - the backend will filter out slots that are too soon based on minimum delay
      const startDate = today.toISOString().split('T')[0]; // Today
      const endDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 14 days from now

      // Get user email from auth context
      const userEmail = auth.user()?.email;
      if (!userEmail) {
        console.error('No user email available');
        setAvailabilityResponse([]);
        return;
      }

      // For debugging - log the user email being used
      console.log('Using email for availability request:', userEmail);
      console.log('Full user object:', auth.user());

      // Prepare request body with user profile data
      const requestBody = {
        duration: selectedDuration(),
        service: selectedService(),
        email: userEmail,
        location: 'OFFICE',
        start: startDate,
        end: endDate,
        userProfile: auth.user() ? {
          name: auth.user()?.name,
          given_name: auth.user()?.given_name,
          family_name: auth.user()?.family_name,
          nickname: auth.user()?.nickname,
          phone_number: auth.user()?.phone_number
        } : undefined
      };

      // Make POST request to availability endpoint
      const response = await fetch('/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data: AvailableSlot[] = await response.json();
        if (data && data.length > 0) {
          setAvailabilityResponse(data);
        } else {
          setAvailabilityResponse([]);
        }
      } else {
        console.error('Availability request failed:', response.status, response.statusText);
        setAvailabilityResponse([]);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      setAvailabilityResponse([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch availability when both service and duration are selected
  createEffect(() => {
    if (selectedService() && selectedDuration() > 0) {
      fetchAvailability();
    }
  });

  // Function to book appointment
  const submitAppointmentRequest = async () => {
    if (!selectedSlot() || !selectedService() || !selectedDuration()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Get user email from auth context
      const userEmail = auth.user()?.email;
      if (!userEmail) {
        setSubmitMessage('Error: No user email available');
        return;
      }

      // Convert ISO timestamp to YYYY-MM-DD HH:mm format (Pacific time)
      const startDate = new Date(selectedSlot()!.startTime);
      const year = startDate.getFullYear();
      const month = String(startDate.getMonth() + 1).padStart(2, '0');
      const day = String(startDate.getDate()).padStart(2, '0');
      const hours = String(startDate.getHours()).padStart(2, '0');
      const minutes = String(startDate.getMinutes()).padStart(2, '0');
      const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;

      const requestBody = {
        service: selectedService(),
        duration: selectedDuration(),
        startTime: formattedDateTime,
        email: userEmail,
        location: selectedSlot()!.location,
        price: selectedPrice()
      };

      console.log('Submitting appointment request:', requestBody);

      const response = await fetch('/appointment-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitMessage(`Success! Your appointment request has been submitted. You'll receive a confirmation email shortly.`);
        // Reset form after successful submission
        setTimeout(() => {
          setSelectedSlot(null);
          setSelectedDuration(0);
          setSelectedPrice(0);
          setSubmitMessage('');
        }, 5000);
      } else {
        const errorData = await response.json();
        setSubmitMessage(`Error: ${errorData.error || 'Failed to submit appointment request'}`);
      }
    } catch (error) {
      console.error('Error submitting appointment request:', error);
      setSubmitMessage('Error: Failed to submit appointment request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get service name from the selected service
  const serviceName = () => selectedService() || props.services[0]?.name || '';

  // Get duration descriptions
  const getDurationDescription = (duration: number) => {
    switch (duration) {
      case 30:
        return 'A gentle 30-minute massage using organic oils to release tension and restore balance.';
      case 60:
        return 'A comprehensive 60-minute full body massage with essential oils and healing crystals.';
      case 90:
        return 'An extended 90-minute session for deep relaxation and complete body healing.';
      default:
        return 'Professional wellness service tailored to your needs.';
    }
  };

  return (
    <div class="space-y-6">
      <div class="text-center space-y-2">
        <h3 class="text-xl font-semibold text-primary">Select Session Duration</h3>
        <p class="text-sm text-muted-foreground">Choose your preferred session length</p>
      </div>

      {/* Duration Selection Cards */}
      <div class="space-y-3">
        {availableDurations().map(duration => {
          const matchingService = props.services.find(s => s.duration === duration);
          const price = matchingService?.price || 0;
          
          return (
            <button
              onClick={() => setSelectedDuration(duration)}
              class={`w-full p-6 flex items-center justify-between border rounded-md transition-all duration-300 group ${
                selectedDuration() === duration
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-primary/20 hover:border-primary hover:bg-primary/3'
              }`}
            >
              <div class="flex items-center gap-4">
                <div class={`p-3 rounded-full transition-colors duration-300 ${
                  selectedDuration() === duration
                    ? 'bg-primary/20'
                    : 'bg-primary/10 group-hover:bg-primary/15'
                }`}>
                  <Clock class="w-6 h-6 text-primary" />
                </div>
                <div class="text-left">
                  <div class="text-lg font-semibold text-primary">{duration} minutes</div>
                  <div class="text-sm text-muted-foreground">{getDurationDescription(duration)}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-primary">${price}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Price Display - Only show if duration is selected */}
      <Show when={selectedDuration() > 0 && selectedPrice() > 0}>
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg font-semibold text-green-900">Selected Service</h3>
              <p class="text-sm text-green-700">
                {serviceName()} - {selectedDuration()} minutes
              </p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-green-900">
                ${selectedPrice().toFixed(2)}
              </p>
              <p class="text-xs text-green-600">Total Price</p>
            </div>
          </div>
        </div>
      </Show>

      {/* Appointment Form - Only show if price is displayed and slot is selected */}
      <Show when={selectedService() && selectedDuration() > 0 && selectedPrice() > 0 && selectedSlot()}>
        <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-blue-900 mb-3">Book Appointment</h3>
          <div class="mb-4">
            <p class="text-sm text-blue-700 mb-2">
              <strong>Selected Time:</strong> {new Date(selectedSlot()!.startTime).toLocaleString()}
            </p>
            <p class="text-sm text-blue-700">
              <strong>Service:</strong> {selectedService()} - {selectedDuration()} minutes
            </p>
          </div>
          
          <button
            onClick={submitAppointmentRequest}
            disabled={isSubmitting()}
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            {isSubmitting() ? 'Booking...' : 'Book Appointment'}
          </button>
          
          <Show when={submitMessage()}>
            <div class={`mt-3 p-3 rounded-md text-sm ${
              submitMessage().includes('Error') 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'bg-green-100 text-green-700 border border-green-200'
            }`}>
              {submitMessage()}
            </div>
          </Show>
        </div>
      </Show>

      {/* Instructions */}
      <div class="mt-6 text-sm text-gray-600">
        <p>1. Choose your preferred session duration from the options above</p>
        <p>2. Review the pricing and service details</p>
        <p>3. Complete your booking when ready</p>
      </div>
    </div>
  );
}
