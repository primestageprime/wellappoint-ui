import { createSignal, createEffect, Show } from 'solid-js';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { BookingForm } from './components/BookingForm';

interface Service {
  name: string;
  duration: number;
  price: number;
}

function ServicesPage() {
  const auth = useAuth();
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
                {auth.user() ? (
                  <div class="flex items-center space-x-2">
                    {auth.user()?.picture && (
                      <img 
                        src={auth.user().picture} 
                        alt="Profile" 
                        class="w-6 h-6 rounded-full"
                      />
                    )}
                    <span>
                      Welcome, {auth.user().nickname || auth.user().given_name || auth.user().name || auth.user().email}
                    </span>
                  </div>
                ) : (
                  'Services Dashboard'
                )}
              </div>
              {auth.user() && (
                <button
                  onClick={auth.logout}
                  class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              )}
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
              
              {loading() && (
                <div class="text-center py-8">
                  <div class="text-gray-500">Loading services...</div>
                </div>
              )}

              {error() && (
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
              )}

              {!loading() && !error() && (
                <div class="flex justify-center">
                  <BookingForm services={services()} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function LoginPage() {
  const auth = useAuth();
  
  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Appointed
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Sign in to view available services
          </p>
        </div>
        <div class="mt-8 space-y-6">
          <div>
            <button
              onClick={auth.login}
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.411 2.865 8.138 6.839 9.465.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C17.137 18.135 20 14.41 20 10c0-5.523-4.477-10-10-10z" clip-rule="evenodd" />
                </svg>
              </span>
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const auth = useAuth();

  return (
    <Show when={auth.isAuthenticated()} fallback={<LoginPage />}>
      <ServicesPage />
    </Show>
  );
}

function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWrapper;
