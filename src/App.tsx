import { Show } from 'solid-js';
import { Router, Route, Navigate, useLocation } from '@solidjs/router';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { LoginPage } from './pages/LoginPage';
import { BookingPage } from './pages/BookingPage';
import { ProviderBookingPage } from './pages/ProviderBookingPage';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { CreateProviderPage } from './pages/CreateProviderPage';
import { OAuthSetupPage } from './pages/OAuthSetupPage';

function LoginWrapper() {
  const location = useLocation();
  console.log('🔍 LoginWrapper - pathname:', location.pathname);
  return <LoginPage intendedUrl={location.pathname} />;
}

function App() {
  const auth = useAuth();
  
  console.log('🔍 App - isAuthenticated:', auth.isAuthenticated());
  console.log('🔍 App - loading:', auth.loading());

  return (
    <Router>
      <Show when={auth.isAuthenticated()} fallback={<LoginWrapper />}>
        {/* Default route - redirect to primestage */}
        <Route path="/" component={() => <Navigate href="/primestage" />} />
        
        {/* Provider-specific booking pages */}
        <Route path="/:username" component={ProviderBookingPage} />
        
        {/* Admin routes */}
        <Route path="/admin/create-provider" component={CreateProviderPage} />
        <Route path="/admin/oauth-setup" component={OAuthSetupPage} />
        
        {/* Legacy routes for backward compatibility */}
        <Route path="/booking" component={BookingPage} />
        <Route path="/design-system" component={DesignSystemPage} />
      </Show>
    </Router>
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
