import { createContext, useContext, JSX, createResource, Resource } from 'solid-js';
import { useParams } from '@solidjs/router';
import { apiFetch } from '../config/api';

// Types for admin data
export interface AdminConfig {
  name: string;
  title: string;
  email: string;
  phone: string;
  headshot?: string;
  minimumAppointmentDelay?: number;
}

export interface AdminService {
  name: string;
  durations: {
    duration: number;
    price: number;
    description: string;
    prep?: { time: number; steps: string[] };
    cleanup?: { time: number; steps: string[] };
  }[];
}

export interface AdminClient {
  preferredName: string;
  pronouns?: string;
  createdAt: string;
  houseCalls: boolean;
  cap: number;
  notes?: string;
}

export interface AdminData {
  username: string;
  config: AdminConfig;
  services: AdminService[];
  clients: AdminClient[];
}

interface AdminContextValue {
  adminData: Resource<AdminData | null>;
  username: () => string;
}

const AdminContext = createContext<AdminContextValue>();

async function fetchAdminData(username: string): Promise<AdminData | null> {
  try {
    // Fetch provider config from /api/provider endpoint
    let config: AdminConfig = {
      name: username,
      title: '',
      email: '',
      phone: '',
    };
    
    try {
      const providerResponse = await apiFetch(`/api/provider?username=${username}`);
      if (providerResponse.ok) {
        const providerData = await providerResponse.json();
        console.log('Provider config response:', JSON.stringify(providerData, null, 2));
        if (providerData.success) {
          // Data is at root level, not nested under 'data'
          config = {
            name: providerData.name || username,
            title: providerData.title || '',
            email: providerData.email || '',
            phone: providerData.phone || '',
            headshot: providerData.headshot,
            minimumAppointmentDelay: providerData.minimumAppointmentDelayMinutes,
          };
        }
      } else {
        console.warn('Provider config response not ok:', providerResponse.status, providerResponse.statusText);
      }
    } catch (e) {
      console.warn('Failed to fetch provider config:', e);
    }
    
    // Fetch services
    let services: AdminService[] = [];
    try {
      const servicesResponse = await apiFetch(`/services?username=${username}`);
      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        services = transformServicesToAdmin(servicesData.data || servicesData || []);
      }
    } catch (e) {
      console.warn('Failed to fetch services:', e);
    }
    
    return {
      username,
      config,
      services,
      clients: [], // TODO: Create backend endpoint for clients
    };
  } catch (error) {
    console.error('Failed to fetch admin data:', error);
    return null;
  }
}

// Transform flat services array to grouped by service name with durations
function transformServicesToAdmin(services: any[]): AdminService[] {
  const serviceMap = new Map<string, AdminService>();
  
  for (const svc of services) {
    const name = svc.name || 'Unknown Service';
    
    if (!serviceMap.has(name)) {
      serviceMap.set(name, { name, durations: [] });
    }
    
    // Parse prep and cleanup from backend format
    // Steps may be comma or newline separated, and may have "-- ", "- ", or "• " prefix
    const parseSteps = (stepsStr: string): string[] => {
      return stepsStr
        .split(/[,\n]/)
        .map((s: string) => s.trim().replace(/^--\s*/, '').replace(/^-\s*/, '').replace(/^•\s*/, ''))
        .filter(Boolean);
    };
    
    const prep = svc.prepMinutes ? {
      time: svc.prepMinutes,
      steps: svc.prepSteps ? parseSteps(svc.prepSteps) : []
    } : undefined;
    
    const cleanup = svc.cleanupMinutes ? {
      time: svc.cleanupMinutes,
      steps: svc.cleanupSteps ? parseSteps(svc.cleanupSteps) : []
    } : undefined;
    
    console.log('Service:', svc.name, 'Prep:', prep, 'Cleanup:', cleanup);
    
    serviceMap.get(name)!.durations.push({
      duration: svc.duration || 0,
      price: svc.price || 0,
      description: svc.durationDescription || '',
      prep,
      cleanup,
    });
  }
  
  return Array.from(serviceMap.values());
}

export function AdminProvider(props: { children: JSX.Element }) {
  const params = useParams();
  const username = () => params.username as string;

  const [adminData] = createResource(username, fetchAdminData);

  const value: AdminContextValue = {
    adminData,
    username,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextValue {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

