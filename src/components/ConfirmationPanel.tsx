import { createSignal, Show } from 'solid-js';
import { useAuth } from '../auth/AuthProvider';
import { 
  Card, 
  H3, 
  H4, 
  CenteredContent, 
  PrimaryHeart, 
  PrimaryCraniosacral, 
  PrimaryFootReflexology 
} from './visual';

interface Service {
  name: string;
  duration: number;
  price: number;
  description?: string;
  durationDescription?: string;
}

interface AvailableSlot {
  startTime: string;
  endTime: string;
  location: string;
}

interface ConfirmationPanelProps {
  service: Service;
  selectedSlot: AvailableSlot;
  isSubmitting: boolean;
  error: string | null;
  onBack: () => void;
  onConfirm: () => void;
}

const serviceIcons = {
  'Massage': PrimaryHeart,
  'Cranial Sacral Massage': PrimaryCraniosacral,
  'Reflexology': PrimaryFootReflexology
};

export function ConfirmationPanel(props: ConfirmationPanelProps) {
  const auth = useAuth();

  // Temporary testing function - remove this in production
  const setupTestData = () => {
    console.log('Setting up test data for confirmation panel');
    // This will be called from the browser console for testing
    (window as any).testConfirmationPanel = () => {
      console.log('Test confirmation panel data:', {
        service: props.service,
        selectedSlot: props.selectedSlot
      });
    };
  };

  // Call setup on component mount
  setupTestData();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleCreateAppointment = () => {
    props.onConfirm();
  };

  const ServiceIcon = serviceIcons[props.service.name as keyof typeof serviceIcons] || PrimaryHeart;

  return (
    <div class="space-y-6">
      <div class="flex items-center space-x-4">
        <button
          onClick={props.onBack}
          class="text-primary hover:text-primary/80 text-sm font-medium"
        >
          ← Back to time selection
        </button>
      </div>

      <CenteredContent>
        <H3>Confirm Your Healing Session</H3>
        <H4>Review your appointment details</H4>
        
        {/* Temporary test button - remove in production */}
        <button
          onClick={() => {
            console.log('Test data:', {
              service: props.service,
              selectedSlot: props.selectedSlot,
              auth: auth.user()
            });
          }}
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded text-sm"
        >
          Test Data (Check Console)
        </button>
      </CenteredContent>

        <Card class="p-6 space-y-6">
          <div class="space-y-4">
            <div class="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
              <ServiceIcon />
              <div>
                <H4>{props.service.name}</H4>
                <p class="text-muted-foreground">{props.service.description}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-muted-foreground">Date & Time</label>
                <div class="text-lg font-semibold text-primary">
                  {formatDate(props.selectedSlot.startTime)} at {formatTime(props.selectedSlot.startTime)}
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-muted-foreground">Duration</label>
                <div class="text-lg font-semibold text-primary">
                  {props.service.duration} minutes
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-muted-foreground">Location</label>
                <div class="text-lg font-semibold text-primary">
                  {props.selectedSlot.location}
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-muted-foreground">Sacred Exchange</label>
                <div class="text-2xl font-bold text-primary">
                  ${props.service.price}
                </div>
              </div>
            </div>

            <Show when={props.service.durationDescription}>
              <div class="space-y-2">
                <label class="text-sm font-medium text-muted-foreground">Session Description</label>
                <p class="text-primary">{props.service.durationDescription}</p>
              </div>
            </Show>
          </div>

          <Show when={props.error}>
            <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-red-600">{props.error}</p>
            </div>
          </Show>

          <div class="flex gap-4">
            <button
              onClick={props.onBack}
              disabled={props.isSubmitting}
              class="flex-1 px-6 py-3 border border-primary/20 rounded-lg text-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={handleCreateAppointment}
              disabled={props.isSubmitting}
              class="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {props.isSubmitting ? 'Creating Appointment...' : 'Confirm Your Sacred Session'}
            </button>
          </div>
        </Card>
      </div>
    );
  }
