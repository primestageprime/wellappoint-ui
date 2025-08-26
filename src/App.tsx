import { Show } from 'solid-js';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { LoginPage } from './pages/LoginPage';
import { ServicesPage } from './pages/ServicesPage';



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
