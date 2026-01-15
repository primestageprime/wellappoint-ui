import { createSignal } from 'solid-js';
import { A } from '@solidjs/router';
import { PageFrame, HeaderCard, Content, Avatar, Split, LogoutButton, Spinner, ProgressButton, MailLink, PhoneNumber, ProviderContent } from '../../components/visual';
import { ServicesList } from '../../components/ServicesList';
import { DurationsList } from '../../components/DurationsList';
import { AppointmentsCard } from '../../components/AppointmentsCard';
import { type BookingService } from '../../types/service';
import { DemoLayout } from './DemoLayout';
import { animateProgress } from '../../utils/progressAnimation';

export function ComponentsStatePage() {
  const [username] = createSignal('katara');

  // State for ProgressButton demo
  const [isLoading, setIsLoading] = createSignal(false);
  const [isSuccess, setIsSuccess] = createSignal(false);
  const [demoProgress, setDemoProgress] = createSignal(0);

  const handleProgressButtonClick = () => {
    setIsLoading(true);
    setIsSuccess(false);
    setDemoProgress(0);

    // Animate progress to 100% over 10 seconds
    animateProgress(
      10000,
      (progress) => setDemoProgress(progress),
      () => {
        setIsLoading(false);
        setIsSuccess(true);

        // Reset after showing success for 3 seconds
        setTimeout(() => {
          setIsSuccess(false);
          setDemoProgress(0);
        }, 3000);
      }
    );
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
                  Click the button to see progress animate linearly over 10 seconds, then fade from light brown to green.
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
                  fixedProgress={demoProgress()}
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
                  <li>Progress animates smoothly to 100%</li>
                  <li>Button fades from light brown to green on completion</li>
                  <li>Disabled during loading and success states</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-xl font-semibold text-primary mb-3">PhoneNumber Component</h3>
            <div class="space-y-4 bg-card p-6 rounded-lg">
              <div>
                <p class="text-sm text-muted-foreground mb-2">Valid Phone Numbers</p>
                <div class="space-y-3">
                  <div>
                    <p class="text-xs text-muted-foreground mb-1">10-digit format:</p>
                    <PhoneNumber phone="4155551234" />
                  </div>
                  <div>
                    <p class="text-xs text-muted-foreground mb-1">Already formatted:</p>
                    <PhoneNumber phone="(415) 555-1234" />
                  </div>
                  <div>
                    <p class="text-xs text-muted-foreground mb-1">With country code:</p>
                    <PhoneNumber phone="+1-415-555-1234" />
                  </div>
                  <div>
                    <p class="text-xs text-muted-foreground mb-1">Mixed format:</p>
                    <PhoneNumber phone="415.555.1234" />
                  </div>
                </div>
              </div>
              <div>
                <p class="text-sm text-muted-foreground mb-2">Invalid/Missing Phone Numbers (not displayed)</p>
                <div class="space-y-3">
                  <div>
                    <p class="text-xs text-muted-foreground mb-1">Too short:</p>
                    <PhoneNumber phone="123456" />
                    <p class="text-xs text-muted-foreground italic">(No output - invalid)</p>
                  </div>
                  <div>
                    <p class="text-xs text-muted-foreground mb-1">Undefined:</p>
                    <PhoneNumber />
                    <p class="text-xs text-muted-foreground italic">(No output - undefined)</p>
                  </div>
                </div>
              </div>
              <div>
                <p class="text-sm text-muted-foreground mb-2">Features</p>
                <ul class="text-xs text-muted-foreground list-disc list-inside space-y-1">
                  <li>Extracts only numeric characters from input</li>
                  <li>Formats as (xxx) xxx-xxxx</li>
                  <li>Creates clickable tel: link for mobile devices</li>
                  <li>Validates 10-digit or 11-digit (with country code 1) numbers</li>
                  <li>Does not display if phone is invalid or missing</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-xl font-semibold text-primary mb-3">MailLink Component</h3>
            <div class="space-y-4 bg-card p-6 rounded-lg">
              <div>
                <p class="text-sm text-muted-foreground mb-2">Valid Email Addresses</p>
                <div class="space-y-3">
                  <div>
                    <p class="text-xs text-muted-foreground mb-1">Standard email:</p>
                    <MailLink email="provider@example.com" />
                  </div>
                  <div>
                    <p class="text-xs text-muted-foreground mb-1">With subdomain:</p>
                    <MailLink email="contact@mail.example.com" />
                  </div>
                </div>
              </div>
              <div>
                <p class="text-sm text-muted-foreground mb-2">Invalid/Missing Emails (not displayed)</p>
                <div class="space-y-3">
                  <div>
                    <p class="text-xs text-muted-foreground mb-1">Missing @ symbol:</p>
                    <MailLink email="notanemail.com" />
                    <p class="text-xs text-muted-foreground italic">(No output - invalid)</p>
                  </div>
                  <div>
                    <p class="text-xs text-muted-foreground mb-1">Missing domain:</p>
                    <MailLink email="user@" />
                    <p class="text-xs text-muted-foreground italic">(No output - invalid)</p>
                  </div>
                  <div>
                    <p class="text-xs text-muted-foreground mb-1">Undefined:</p>
                    <MailLink />
                    <p class="text-xs text-muted-foreground italic">(No output - undefined)</p>
                  </div>
                </div>
              </div>
              <div>
                <p class="text-sm text-muted-foreground mb-2">Features</p>
                <ul class="text-xs text-muted-foreground list-disc list-inside space-y-1">
                  <li>Validates email format with regex</li>
                  <li>Creates clickable mailto: link</li>
                  <li>Does not display if email is invalid or missing</li>
                  <li>Displays email address as link text by default</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-xl font-semibold text-primary mb-3">ProviderContent Component</h3>
            <div class="space-y-4 bg-card p-6 rounded-lg">
              <div>
                <p class="text-sm text-muted-foreground mb-2">Complete Profile (all fields)</p>
                <ProviderContent
                  name="Dr. Jane Smith"
                  email="jane.smith@example.com"
                  phone="(415) 555-1234"
                  title="Licensed Massage Therapist"
                />
              </div>
              <div>
                <p class="text-sm text-muted-foreground mb-2">Profile without phone</p>
                <ProviderContent
                  name="Dr. John Doe"
                  email="john.doe@example.com"
                  title="Craniosacral Therapist"
                />
              </div>
              <div>
                <p class="text-sm text-muted-foreground mb-2">Profile without email</p>
                <ProviderContent
                  name="Dr. Sarah Johnson"
                  phone="(415) 555-5678"
                  title="Physical Therapist"
                />
              </div>
              <div>
                <p class="text-sm text-muted-foreground mb-2">Features</p>
                <ul class="text-xs text-muted-foreground list-disc list-inside space-y-1">
                  <li>Displays provider name, title, email, and phone</li>
                  <li>Email and phone are optional - only shows if valid</li>
                  <li>Email uses MailLink component (mailto: link)</li>
                  <li>Phone uses PhoneNumber component (tel: link with formatting)</li>
                  <li>Includes appropriate icons for each field</li>
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

