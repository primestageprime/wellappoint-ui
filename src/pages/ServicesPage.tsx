import { createSignal, createEffect, Show } from 'solid-js';

interface Service {
  name: string;
  duration: number;
  price: number;
}

function ServicesPage() {
  const [services, setServices] = createSignal<Service[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/services');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  createEffect(() => {
    fetchServices();
  });

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Header */}
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <div class="flex items-center">
              <h1 class="text-3xl font-bold text-gray-900">Appointed</h1>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-sm text-gray-700">
                Services Dashboard
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h2 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Available Services
              </h2>
              
              <Show when={loading()}>
                <div class="text-center py-8">
                  <div class="text-gray-500">Loading services...</div>
                </div>
              </Show>

              <Show when={error()}>
                <div class="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                  <div class="text-red-700">
                    Error: {error()}
                  </div>
                  <button
                    onClick={fetchServices}
                    class="mt-2 text-red-600 hover:text-red-800 underline"
                  >
                    Try again
                  </button>
                </div>
              </Show>

              <Show when={!loading() && !error()}>
                <div class="bg-gray-50 rounded-lg p-4">
                  <pre class="text-sm text-gray-800 whitespace-pre-wrap overflow-auto">
                    {JSON.stringify(services(), null, 2)}
                  </pre>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ServicesPage;
