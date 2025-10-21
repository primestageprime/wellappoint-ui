import { createContext, useContext, JSX, createResource, Resource, onMount, onCleanup } from 'solid-js';
import { useParams } from '@solidjs/router';
import { useAuth } from '../auth/AuthProvider';

// Raw calendar event structure
export interface CalendarEvent {
  startTime: string;
  endTime: string;
  summary?: string;
  location?: string;
}

export interface CalendarData {
  events: CalendarEvent[];
  fetchedAt: Date;
}

interface CalendarContextValue {
  calendarData: Resource<CalendarData | undefined>;
  refetch: () => void;
}

const CalendarContext = createContext<CalendarContextValue>();

async function fetchCalendarEvents(username: string, email: string): Promise<CalendarData> {
  console.log('📅 fetchCalendarEvents called for:', { username, email });
  
  // Calculate date range (next 2 weeks)
  const today = new Date();
  const twoWeeksFromNow = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  
  const formatDateToISO = (date: Date) => date.toISOString().split('T')[0];
  
  const params = new URLSearchParams({
    email: email,
    username: username,
    start: formatDateToISO(today),
    end: formatDateToISO(twoWeeksFromNow)
  });
  
  // Try to fetch calendar events - endpoint doesn't exist yet, so gracefully handle 404
  try {
    const response = await fetch(`/api/calendar/events?${params}`);
    
    if (response.status === 404) {
      console.log('⚠️ Calendar endpoint not implemented yet, returning empty events');
      return {
        events: [],
        fetchedAt: new Date()
      };
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Calendar events fetched');
    
    return {
      events: data.events || [],
      fetchedAt: new Date()
    };
  } catch (error) {
    console.warn('⚠️ Calendar fetch failed, returning empty events:', error);
    return {
      events: [],
      fetchedAt: new Date()
    };
  }
}

export function CalendarProvider(props: { children: JSX.Element }) {
  const params = useParams();
  const auth = useAuth();
  
  const username = () => params.username as string;
  const userEmail = () => auth.user()?.email;
  
  // Fetch calendar events (raw availability data)
  const [calendarData, { refetch }] = createResource(
    () => {
      const user = userEmail();
      const uname = username();
      return user && uname ? { username: uname, email: user } : null;
    },
    async (params) => {
      if (!params) return undefined;
      return await fetchCalendarEvents(params.username, params.email);
    }
  );
  
  // Auto-refresh every 5 minutes
  onMount(() => {
    const intervalId = setInterval(() => {
      console.log('🔄 Auto-refreshing calendar data');
      refetch();
    }, 5 * 60 * 1000); // 5 minutes
    
    onCleanup(() => {
      console.log('🛑 Clearing calendar auto-refresh interval');
      clearInterval(intervalId);
    });
  });
  
  const value: CalendarContextValue = {
    calendarData,
    refetch,
  };
  
  return (
    <CalendarContext.Provider value={value}>
      {props.children}
    </CalendarContext.Provider>
  );
}

export function useCalendar(): CalendarContextValue {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}

