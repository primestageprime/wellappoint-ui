import { createSignal } from 'solid-js';
import { A } from '@solidjs/router';
import { PageFrame, HeaderCard, Content, Avatar, Split, LogoutButton, Spinner, ProgressButton } from '../../components/visual';
import { ServicesList } from '../../components/ServicesList';
import { DurationsList } from '../../components/DurationsList';
import { AppointmentsCard } from '../../components/AppointmentsCard';
import { type BookingService } from '../../types/service';
import { DemoLayout } from './DemoLayout';

export function ComponentsStatePage() {
  const [username] = createSignal('katara');

  // State for ProgressButton demo
  const [isLoading, setIsLoading] = createSignal(false);
  const [isSuccess, setIsSuccess] = createSignal(false);

  const handleProgressButtonClick = () => {
    setIsLoading(true);
    setIsSuccess(false);

    // Simulate async operation
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      // Reset after showing success
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    }, 3000);
  };

  const [services] = createSignal<BookingService[]>([
    {
      name: 'Massage',
      description: 'Deep tissue & relaxation therapy',
      duration: 30,
      price: 85,
      durationDescription: 'A gentle 30-minute massage using organic oils'
    },
    {
      name: 'Massage',
      description: 'Deep tissue & relaxation therapy',
      duration: 60,
      price: 140,
      durationDescription: 'A comprehensive 60-minute full body massage'
    },
    {
      name: 'Cranial Sacral Massage',
      description: 'Gentle energy work & alignment',
      duration: 60,
      price: 150,
      durationDescription: 'Gentle craniosacral therapy session'
    }
  ]);

  return (
    <DemoLayout>
    <PageFrame>
      <HeaderCard>
        <Split 
          left={<Avatar username={username} />}
          right={<LogoutButton onLogout={() => console.log('Logout')}>Logout</LogoutButton>}
        />
      </HeaderCard>
      
      <Content>
        <div class="space-y-8">
          <div>
            <h2 class="text-2xl font-bold text-primary mb-4">Individual Components Demo</h2>
            <p class="text-muted-foreground mb-8">Each component shown in isolation</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold text-primary mb-3">AppointmentsCard</h3>
            <AppointmentsCard />
          </div>

          <div>
            <h3 class="text-xl font-semibold text-primary mb-3">ServicesList</h3>
            <ServicesList 
              services={services()}
              onServiceSelect={(service) => console.log('Selected:', service)}
            />
          </div>

          <div>
            <h3 class="text-xl font-semibold text-primary mb-3">DurationsList</h3>
            <DurationsList
              services={services()}
              selectedService="Massage"
              onDurationSelect={(duration) => console.log('Selected:', duration)}
              onBack={() => console.log('Back')}
            />
          </div>

          <div>
            <h3 class="text-xl font-semibold text-primary mb-3">Spinner Component</h3>
            <div class="space-y-4 bg-card p-6 rounded-lg">
              <div>
                <p class="text-sm text-muted-foreground mb-2">Default (24px)</p>
                <div class="flex items-center justify-center p-4 bg-white rounded">
                  <Spinner />
                </div>
              </div>
              <div>
                <p class="text-sm text-muted-foreground mb-2">Small (16px)</p>
                <div class="flex items-center justify-center p-4 bg-white rounded">
                  <Spinner size={16} />
                </div>
              </div>
              <div>
                <p class="text-sm text-muted-foreground mb-2">Large (48px)</p>
                <div class="flex items-center justify-center p-4 bg-white rounded">
                  <Spinner size={48} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-xl font-semibold text-primary">ProgressButton Component</h3>
              <A
                href="/demo/components/progress-button"
                class="text-sm text-primary hover:underline"
              >
                View detailed page →
              </A>
            </div>
            <div class="space-y-6 bg-card p-6 rounded-lg">
              <div>
                <p class="text-sm text-muted-foreground mb-2">Interactive Demo</p>
                <p class="text-xs text-muted-foreground mb-4">
                  Click the button to see the progress animation. Shows progress for 3 seconds, then success state for 2 seconds.
                </p>
                <ProgressButton
                  text="Submit Form"
                  loadingText="Processing..."
                  successText="Success!"
                  isLoading={isLoading()}
                  isSuccess={isSuccess()}
                  taskId="demo-task"
                  type="button"
                  onClick={handleProgressButtonClick}
                />
              </div>

              <div>
                <p class="text-sm text-muted-foreground mb-2">Usage Examples</p>
                <div class="space-y-3">
                  <div>
                    <p class="text-xs text-muted-foreground mb-2">Book Appointment:</p>
                    <ProgressButton
                      text="Confirm Your Session"
                      loadingText="Submitting your appointment..."
                      successText="Appointment Booked!"
                      isLoading={false}
                      isSuccess={false}
                      taskId="booking-appointment"
                      type="button"
                      onClick={() => console.log('Booking clicked')}
                    />
                  </div>

                  <div>
                    <p class="text-xs text-muted-foreground mb-2">Create Provider:</p>
                    <ProgressButton
                      text="Complete Setup"
                      loadingText="Creating your account..."
                      successText="Account Created!"
                      isLoading={false}
                      isSuccess={false}
                      taskId="create-provider"
                      type="submit"
                      onClick={() => console.log('Setup clicked')}
                    />
                  </div>
                </div>
              </div>

              <div>
                <p class="text-sm text-muted-foreground mb-2">Features</p>
                <ul class="text-xs text-muted-foreground list-disc list-inside space-y-1">
                  <li>Horizontal progress bar fills from left to right</li>
                  <li>Uses historical task times for accurate progress estimation</li>
                  <li>Progress capped at 95% to indicate uncertainty</li>
                  <li>Smooth transition to success state with animation</li>
                  <li>Disabled during loading and success states</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </PageFrame>
    </DemoLayout>
  );
}

