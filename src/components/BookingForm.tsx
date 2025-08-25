import { createSignal, createEffect, For, Show } from 'solid-js';
import { SegmentedControl } from '@kobalte/core/segmented-control';
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

interface Service {
  name: string;
  duration: number;
  price: number;
}

interface BookingFormProps {
  services: Service[];
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

  // Update available durations when service changes
  createEffect(() => {
    const service = uniqueServices().find(s => s.name === selectedService());
    if (service) {
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
      const startDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
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

      // Temporary fix: Use the correct email address
      const correctEmail = 'peter.stradinger@primestagetechnology.com';

      // Build query parameters for GET request
      const params = new URLSearchParams({
        duration: selectedDuration().toString(),
        service: selectedService(),
        email: correctEmail,
        location: 'OFFICE',
        start: startDate,
        end: endDate
      });

      // Make GET request to availability endpoint
      const response = await fetch(`http://localhost:8000/availability?${params.toString()}`);

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

  // Function to submit appointment request
  const submitAppointmentRequest = async () => {
    if (!selectedSlot() || !selectedService() || !selectedDuration()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Convert ISO timestamp to YYYY-MM-DD HH:mm format (Pacific time)
      const startDate = new Date(selectedSlot()!.startTime);
      const year = startDate.getFullYear();
      const month = String(startDate.getMonth() + 1).padStart(2, '0');
      const day = String(startDate.getDate()).padStart(2, '0');
      const hours = String(startDate.getHours()).padStart(2, '0');
      const minutes = String(startDate.getMinutes()).padStart(2, '0');
      const formattedStart = `${year}-${month}-${day} ${hours}:${minutes}`;

      const request = {
        service: selectedService(),
        duration: selectedDuration(),
        location: 'OFFICE',
        email: 'peter.stradinger@primestagetechnology.com',
        start: formattedStart
      };

      const response = await fetch('http://localhost:8000/appointment_request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitMessage('Appointment request submitted successfully!');
        console.log('Appointment request result:', result);
      } else {
        const errorData = await response.json();
        setSubmitMessage(`Error: ${errorData.error || 'Failed to submit appointment request'}`);
        console.error('Appointment request failed:', errorData);
      }
    } catch (error) {
      console.error('Error submitting appointment request:', error);
      setSubmitMessage('Error: Failed to submit appointment request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div class="w-2/3 mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Book Your Appointment</h2>
      
      {/* Service Selection */}
      <div class="mb-6">
        <SegmentedControl 
          value={selectedService()} 
          onChange={setSelectedService}
          class="w-full"
        >
          <SegmentedControl.Label class="block text-sm font-medium text-gray-700 mb-3">
            Select Service
          </SegmentedControl.Label>
          <div role="presentation" class="flex bg-gray-100 rounded-lg p-1 relative">
            <SegmentedControl.Indicator />
            <div role="presentation" class="flex flex-1 relative">
              <For each={uniqueServices()}>
                {(service) => (
                  <SegmentedControl.Item 
                    value={service.name}
                    class="flex-1 relative px-3 py-2 text-sm font-medium text-gray-700 rounded-md cursor-pointer transition-colors duration-200 border border-black data-[checked]:border-black data-[checked]:bg-white"
                  >
                    <SegmentedControl.ItemInput />
                    <SegmentedControl.ItemLabel class="block text-center">
                      {service.name}
                    </SegmentedControl.ItemLabel>
                  </SegmentedControl.Item>
                )}
              </For>
            </div>
          </div>
        </SegmentedControl>
      </div>

      {/* Duration Selection - Only show if service is selected */}
      <Show when={selectedService() && availableDurations().length > 0}>
        <div class="mb-6">
          <SegmentedControl 
            value={selectedDuration().toString()} 
            onChange={(value) => setSelectedDuration(parseInt(value))}
            class="w-full"
          >
            <SegmentedControl.Label class="block text-sm font-medium text-gray-700 mb-3">
              Select Duration
            </SegmentedControl.Label>
            <div role="presentation" class="flex bg-gray-100 rounded-lg p-1 relative">
              <SegmentedControl.Indicator />
                          <div role="presentation" class="flex flex-1 relative">
              <For each={availableDurations()}>
                {(duration) => (
                  <SegmentedControl.Item 
                    value={duration.toString()}
                    class="flex-1 relative px-3 py-2 text-sm font-medium text-gray-700 rounded-md cursor-pointer transition-colors duration-200 border border-black data-[checked]:border-black data-[checked]:bg-white"
                  >
                    <SegmentedControl.ItemInput />
                    <SegmentedControl.ItemLabel class="block text-center">
                      {duration} min
                    </SegmentedControl.ItemLabel>
                  </SegmentedControl.Item>
                )}
              </For>
            </div>
            </div>
          </SegmentedControl>
        </div>
      </Show>

      {/* Price Display - Only show if both service and duration are selected */}
      <Show when={selectedService() && selectedDuration() > 0 && selectedPrice() > 0}>
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg font-semibold text-green-900">Selected Service</h3>
              <p class="text-sm text-green-700">
                {selectedService()} - {selectedDuration()} minutes
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

      {/* Appointment Request Form - Only show if price is displayed and slot is selected */}
      <Show when={selectedService() && selectedDuration() > 0 && selectedPrice() > 0 && selectedSlot()}>
        <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-blue-900 mb-3">Request Appointment</h3>
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
            {isSubmitting() ? 'Submitting...' : 'Submit Appointment Request'}
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
        <p>1. Choose your service from the options above</p>
        <p>2. Select your preferred duration</p>
        <p>3. Review the price and proceed with booking</p>
      </div>

      {/* Availability Response */}
      <Show when={isLoading()}>
        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-blue-700">Loading availability...</p>
        </div>
      </Show>

      <Show when={availabilityResponse() !== null}>
        <div class="mt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Available Time Slots</h3>
          <Show when={availabilityResponse() && availabilityResponse()!.length > 0} fallback={
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p class="text-yellow-700">No results found</p>
            </div>
          }>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <For each={availabilityResponse()}>
                {(slot) => (
                  <button
                    onClick={() => setSelectedSlot(slot)}
                    class={`p-3 rounded-lg border-2 transition-colors duration-200 text-left ${
                      selectedSlot()?.startTime === slot.startTime
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div class="font-medium text-gray-900">
                      {new Date(slot.startTime).toLocaleDateString()}
                    </div>
                    <div class="text-sm text-gray-600">
                      {new Date(slot.startTime).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })} - {new Date(slot.endTime).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    <div class="text-xs text-gray-500 mt-1">
                      {slot.isOptimal ? 'Optimal time' : 'Available time'}
                    </div>
                  </button>
                )}
              </For>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
}
