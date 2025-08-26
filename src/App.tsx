import { createSignal, createEffect, Show } from 'solid-js';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { BookingForm } from './components/BookingForm';
import { WellAppointLogo } from './components/WellAppointLogo';
import { LogOut, User } from 'lucide-solid';

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
            <div class="flex items-center">
              <WellAppointLogo className="mr-3 text-card-foreground" />
              <h1 class="text-3xl font-bold text-card-foreground">WellAppoint</h1>
            </div>
          </div>
          
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

function LoginPage() {
  const auth = useAuth();
  
  return (
    <div class="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div class="paper-background">
        <div class="max-w-md w-full space-y-8">
          <div>
            <div class="flex justify-center mb-4">
              <WellAppointLogo className="text-card-foreground" />
            </div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-card-foreground">
              WellAppoint
            </h2>
            <p class="mt-2 text-center text-sm text-muted-foreground">
              Keep coming back to the Well
            </p>
          </div>
          <div class="mt-8 space-y-6">
            <div class="text-center">
              <p class="text-sm text-muted-foreground mb-4">
                Sign in to continue
              </p>
              <button
                onClick={auth.login}
                class="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-card-foreground bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
              >
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg class="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </span>
                Continue with Google
              </button>
            </div>
            <div class="text-center">
              <p class="text-xs text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
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
