import { createSignal, createEffect } from 'solid-js';
import { useAuth } from '../auth/AuthProvider';
import { WellAppointLogo } from '../components/WellAppointLogo';
import { ProviderCard } from '../components/ProviderCard';
import { AppointmentsCard } from '../components/AppointmentsCard';
import { ServicesList } from '../components/ServicesList';
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
      {/* Main Content with white page background */}
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="bg-card rounded-lg shadow-sm border border-border/20">
          {/* Auth Header */}
          <div class="bg-background rounded-t-lg p-4 mb-6">
            <div class="flex justify-between items-center">
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
                class="flex items-center gap-2 text-primary hover:text-primary/80 hover:bg-primary/10 hover:border hover:border-primary/20 cursor-pointer px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 border-0 bg-transparent"
              >
                <LogOut class="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Content with padding */}
          <div class="px-6 sm:px-8 pb-6 sm:pb-8">
            {/* Logo and Title */}
            <div class="flex justify-center mb-8">
              <div class="flex items-center flex-col">
                <WellAppointLogo className="mr-3 text-card-foreground" size={40} />
                <h1 class="text-small text-card-foreground !text-sm font-normal">WellAppoint</h1>
              </div>
            </div>
            
            {/* Provider Card */}
            <ProviderCard />
            
            {/* Appointments Card */}
            <AppointmentsCard />
            
            {/* Services Section */}
            <div class="bg-card shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
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
                  <ServicesList services={services()} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
