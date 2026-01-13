import { createContext, useContext, JSX, createResource, Resource } from 'solid-js';
import { useParams } from '@solidjs/router';
import { type BookingService } from '../types/service';
import { apiFetch } from '../config/api';
import { taskMetrics } from '../utils/taskMetrics';

interface ServicesContextValue {
  services: Resource<BookingService[]>;
}

const ServicesContext = createContext<ServicesContextValue>();

async function fetchServices(username: string): Promise<BookingService[]> {
  const startTime = Date.now();
  try {
    const response = await apiFetch(`/services?username=${username}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Record task completion time
    const elapsedMs = Date.now() - startTime;
    taskMetrics.recordTask('loading-services', elapsedMs);

    // Extract services array from response
    return data.data || data;
  } catch (error) {
    // Still record the time even on error
    const elapsedMs = Date.now() - startTime;
    taskMetrics.recordTask('loading-services', elapsedMs);
    throw error;
  }
}

export function ServicesProvider(props: { children: JSX.Element }) {
  const params = useParams();
  const username = () => params.username as string;

  // createResource auto-handles refetching when username changes
  const [services] = createResource(username, fetchServices);

  const value: ServicesContextValue = {
    services,
  };

  return (
    <ServicesContext.Provider value={value}>
      {props.children}
    </ServicesContext.Provider>
  );
}

export function useServices(): ServicesContextValue {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
}

