import { Show } from 'solid-js';
import { Router, Route, Navigate, useLocation } from '@solidjs/router';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { BookingProvider } from './stores/bookingStore';
import { ServicesProvider } from './stores/servicesStore';
import { CalendarProvider } from './stores/calendarStore';
import { LoginPage } from './pages/LoginPage';
import { BookingPage } from './pages/BookingPage';
import { ProviderBookingPage } from './pages/ProviderBookingPage';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { LayoutDemoPage } from './pages/LayoutDemoPage';
import { CreateProviderPage } from './pages/CreateProviderPage';
import { OAuthSetupPage } from './pages/OAuthSetupPage';
import { ProviderReauthPage } from './pages/ProviderReauthPage';
import { DemoIndexPage } from './pages/demo/DemoIndexPage';
import { ComponentsStatePage } from './pages/demo/ComponentsStatePage';
import { LoginStatePage } from './pages/demo/LoginStatePage';
import { ChooseServiceStatePage } from './pages/demo/ChooseServiceStatePage';
import { ChooseDurationStatePage } from './pages/demo/ChooseDurationStatePage';
import { FindingSlotsStatePage } from './pages/demo/FindingSlotsStatePage';
import { ChooseSlotStatePage } from './pages/demo/ChooseSlotStatePage';
import { ConfirmStatePage } from './pages/demo/ConfirmStatePage';
import { ProcessingStatePage } from './pages/demo/ProcessingStatePage';
import { ReceiptStatePage } from './pages/demo/ReceiptStatePage';

function LoginWrapper() {
  const location = useLocation();
  console.log('🔍 LoginWrapper - pathname:', location.pathname);
  return <LoginPage intendedUrl={location.pathname} />;
}

// Wrapper component for provider-specific booking page
function ProviderBookingPageWrapper() {
  return (
    <ServicesProvider>
      <CalendarProvider>
        <ProviderBookingPage />
      </CalendarProvider>
    </ServicesProvider>
  );
}

function App() {
  const auth = useAuth();
  
  console.log('🔍 App - isAuthenticated:', auth.isAuthenticated());
  console.log('🔍 App - loading:', auth.loading());

  // Get the user's provider username for the default route
  const getDefaultRoute = () => {
    const user = auth.user();
    if (user?.nickname) {
      return `/${user.nickname}`;
    }
    return '/primestage'; // fallback
  };

  return (
    <BookingProvider>
      <Router>
        <Show when={auth.isAuthenticated()}>
          {/* Default route - redirect to user's provider page */}
          <Route path="/" component={() => <Navigate href={getDefaultRoute()} />} />
          
          {/* Provider-specific booking pages - wrap with providers */}
          <Route path="/:username" component={ProviderBookingPageWrapper} />
          
          {/* Provider re-authentication */}
          <Route path="/:username/authorize" component={ProviderReauthPage} />
          
          {/* Admin routes */}
          <Route path="/admin/create-provider" component={CreateProviderPage} />
          <Route path="/admin/oauth-setup" component={OAuthSetupPage} />
          
          {/* Legacy routes for backward compatibility */}
          <Route path="/booking" component={BookingPage} />
          <Route path="/design-system" component={DesignSystemPage} />
          <Route path="/layout-demo" component={LayoutDemoPage} />
          
          {/* Demo state pages */}
          <Route path="/demo" component={DemoIndexPage} />
          <Route path="/demo/components" component={ComponentsStatePage} />
          <Route path="/demo/login" component={LoginStatePage} />
          <Route path="/demo/choose-service" component={ChooseServiceStatePage} />
          <Route path="/demo/choose-duration" component={ChooseDurationStatePage} />
          <Route path="/demo/finding-slots" component={FindingSlotsStatePage} />
          <Route path="/demo/choose-slot" component={ChooseSlotStatePage} />
          <Route path="/demo/confirm" component={ConfirmStatePage} />
          <Route path="/demo/processing" component={ProcessingStatePage} />
          <Route path="/demo/receipt" component={ReceiptStatePage} />
        </Show>
        
        {/* Login route - accessible when not authenticated */}
        <Route path="*" component={LoginWrapper} />
      </Router>
    </BookingProvider>
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
