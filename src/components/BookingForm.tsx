import { createSignal, createEffect, For, Show } from 'solid-js';
import { SegmentedControl } from '@kobalte/core/segmented-control';

interface Service {
  name: string;
  duration: number;
  price: number;
}

interface BookingFormProps {
  services: Service[];
}

export function BookingForm(props: BookingFormProps) {
  const [selectedService, setSelectedService] = createSignal<string>('');
  const [selectedDuration, setSelectedDuration] = createSignal<number>(0);
  const [availableDurations, setAvailableDurations] = createSignal<number[]>([]);
  const [selectedPrice, setSelectedPrice] = createSignal<number>(0);

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

      {/* Instructions */}
      <div class="mt-6 text-sm text-gray-600">
        <p>1. Choose your service from the options above</p>
        <p>2. Select your preferred duration</p>
        <p>3. Review the price and proceed with booking</p>
      </div>
    </div>
  );
}
