import { Show } from 'solid-js';
import { 
  Card, 
  H3, 
  H4, 
  CenteredContent, 
  PrimaryHeart, 
  PrimaryCraniosacral, 
  PrimaryFootReflexology,
  ServiceSummaryCard,
  AppointmentDetailsGrid,
  ActionButtons,
  SessionDescription
} from './visual';
import { Calendar, Globe, Currency } from './visual/icons';
import { Clock } from 'lucide-solid';
import { type ConfirmationPanelProps } from '../types/components';
import { formatFullDate, formatTime } from '../utils/dateUtils';

const serviceIcons = {
  'Massage': PrimaryHeart,
  'Cranial Sacral Massage': PrimaryCraniosacral,
  'Reflexology': PrimaryFootReflexology
};

export function ConfirmationPanel(props: ConfirmationPanelProps) {
  console.log('🔍 ConfirmationPanel render - props.service:', props.service);
  console.log('🔍 ConfirmationPanel render - props.success:', props.success);
  console.log('🔍 ConfirmationPanel render - props.error:', props.error);
  console.log('🔍 ConfirmationPanel render - props.isSubmitting:', props.isSubmitting);
  
  // Safety check - if service is undefined, show error
  if (!props.service) {
    console.log('🔍 ConfirmationPanel - service is undefined, showing error');
    return (
      <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-600">Error: Service data not found. Please go back and select a service again.</p>
        <button 
          onClick={props.onBack}
          class="mt-2 text-sm text-red-600 hover:text-red-800"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  // Show success message if booking was successful
  const showSuccess = props.success && props.service && props.selectedSlot;
  console.log('🔍 ConfirmationPanel - showSuccess:', showSuccess, 'props.success:', props.success, 'props.service:', !!props.service, 'props.selectedSlot:', !!props.selectedSlot);
  
  if (showSuccess) {
    console.log('🔍 ConfirmationPanel - Showing success message');
    return (
      <div class="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
        <div class="text-green-600 text-lg font-semibold mb-2">✅ Appointment Created Successfully!</div>
        <p class="text-green-700 mb-4">Your appointment has been confirmed and added to your calendar.</p>
        <div class="text-sm text-green-600 mb-4">
          <p><strong>Service:</strong> {props.service.name}</p>
          <p><strong>Date & Time:</strong> {formatFullDate(props.selectedSlot.startTime)} at {formatTime(props.selectedSlot.startTime)}</p>
          <p><strong>Duration:</strong> {props.service.duration} minutes</p>
          <p><strong>Price:</strong> ${props.service.price}</p>
        </div>
        <button 
          onClick={props.onBookAnother}
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Book Another Appointment
        </button>
      </div>
    );
  }

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
      </CenteredContent>

        <Card class="p-6 space-y-6">
          <div class="space-y-4">
            <ServiceSummaryCard
              icon={<ServiceIcon />}
              title={props.service.name}
              subtitle={props.service.description || ''}
            />

            <AppointmentDetailsGrid
              details={[
                {
                  label: 'Date & Time',
                  value: `${formatFullDate(props.selectedSlot.startTime)} at ${formatTime(props.selectedSlot.startTime)}`,
                  icon: <Calendar class="w-5 h-5 text-primary" />
                },
                {
                  label: 'Duration',
                  value: `${props.service.duration} minutes`,
                  icon: <Clock class="w-5 h-5 text-primary" />
                },
                {
                  label: 'Location',
                  value: props.selectedSlot.location,
                  icon: <Globe class="w-5 h-5 text-primary" />
                },
                {
                  label: 'Price',
                  value: `$${props.service.price}`,
                  icon: <Currency class="w-5 h-5 text-primary" />
                }
              ]}
            />

            <Show when={props.service?.durationDescription}>
              <SessionDescription description={props.service?.durationDescription || ''} />
            </Show>
          </div>

          <Show when={props.error}>
            <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-red-600">{props.error}</p>
            </div>
          </Show>

          <ActionButtons
            buttons={[
              {
                text: props.isSubmitting ? 'Creating Appointment...' : 'Confirm Your Session',
                onClick: handleCreateAppointment,
                variant: 'primary',
                disabled: props.isSubmitting
              }
            ]}
          />
        </Card>
      </div>
    );
  }
