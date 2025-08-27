import { Show, createSignal } from 'solid-js';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { LoginPage } from './pages/LoginPage';
import { ServicesPage } from './pages/ServicesPage';
import { DesignSystemPage } from './pages/DesignSystemPage';

function App() {
  const auth = useAuth();
  const [currentPage, setCurrentPage] = createSignal<'services' | 'design-system'>('services');

  return (
    <Show when={auth.isAuthenticated()} fallback={<LoginPage />}>
      <div>
        {/* Navigation */}
        <nav class="bg-background border-b border-border/20 p-4">
          <div class="max-w-7xl mx-auto flex gap-4">
            <button
              onClick={() => setCurrentPage('services')}
              class={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                currentPage() === 'services'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-primary hover:bg-primary/10'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => setCurrentPage('design-system')}
              class={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                currentPage() === 'design-system'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-primary hover:bg-primary/10'
              }`}
            >
              Design System
            </button>
          </div>
        </nav>

        {/* Page Content */}
        <Show when={currentPage() === 'services'} fallback={<DesignSystemPage />}>
          <ServicesPage />
        </Show>
      </div>
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
