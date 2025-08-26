import { createSignal, createEffect } from 'solid-js';
import { useAuth } from '../auth/AuthProvider';
import { BookingForm } from '../components/BookingForm';
import { WellAppointLogo } from '../components/WellAppointLogo';
import { ProviderCard } from '../components/ProviderCard';
import { LogOut, User } from 'lucide-solid';

interface Service {
  name: string;
  duration: number;
  price: number;
}

export function ServicesPage() {
  const auth = useAuth();
  const [services, setServices] = createSignal<Service[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/services');
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
    <div class="min-h-screen bg-background">
      {/* Header */}
      <header class="bg-background border-b border-border/20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User class="w-4 h-4 text-primary" />
              </div>
              <div>
                <p class="text-sm text-primary">Welcome back,</p>
                <p class="text-primary">{auth.user()?.nickname || auth.user()?.given_name || auth.user()?.name || auth.user()?.email}</p>
              </div>
            </div>
            <button
              onClick={auth.logout}
              class="flex items-center gap-2 text-primary hover:text-primary/80 hover:bg-primary/5 px-3 py-1.5 rounded text-sm font-medium"
            >
              <LogOut class="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          {/* Logo and Title */}
          <div class="flex justify-center mb-8">
            <div class="flex items-center flex-col">
              <WellAppointLogo className="mr-3 text-card-foreground" size={40} />
              <h1 class="text-small text-card-foreground !text-sm font-normal">WellAppoint</h1>
            </div>
          </div>
          
          {/* Provider Card */}
          <ProviderCard />
          
          <div class="bg-card shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h2 class="text-lg leading-6 font-medium text-card-foreground mb-4">
                Available Services
              </h2>
              
              {loading() && (
                <div class="text-center py-8">
                  <div class="text-muted-foreground">Loading services...</div>
                </div>
              )}

              {error() && (
                <div class="bg-destructive/10 border border-destructive/20 rounded-md p-4 mb-4">
                  <div class="text-destructive">
                    Error: {error()}
                  </div>
                  <button
                    onClick={fetchServices}
                    class="mt-2 text-destructive hover:text-destructive/80 underline"
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
