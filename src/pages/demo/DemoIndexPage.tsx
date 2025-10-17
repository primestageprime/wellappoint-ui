import { A } from '@solidjs/router';
import { PageFrame, Content } from '../../components/visual';

export function DemoIndexPage() {
  const demoPages = [
    { 
      path: '/demo/components', 
      label: 'COMPONENTS',
      description: 'View individual stateless components in isolation'
    },
    { 
      path: '/demo/login', 
      label: 'LOGIN',
      description: 'State: User needs to authenticate'
    },
    { 
      path: '/demo/choose-service', 
      label: 'CHOOSE SERVICE',
      description: 'State: User selects which service they want'
    },
    { 
      path: '/demo/choose-duration', 
      label: 'CHOOSE DURATION',
      description: 'State: User selects session length'
    },
    { 
      path: '/demo/finding-slots', 
      label: 'FINDING SLOTS',
      description: 'State: Loading available appointment times'
    },
    { 
      path: '/demo/choose-slot', 
      label: 'CHOOSE SLOT',
      description: 'State: User selects specific date/time'
    },
    { 
      path: '/demo/confirm', 
      label: 'CONFIRM',
      description: 'State: User reviews and confirms appointment'
    },
    { 
      path: '/demo/processing', 
      label: 'PROCESSING',
      description: 'State: Submitting appointment request'
    },
    { 
      path: '/demo/receipt', 
      label: 'RECEIPT',
      description: 'State: Success! Appointment confirmed'
    }
  ];

  return (
    <PageFrame>
      <Content>
        <div class="py-12 space-y-8">
          <div class="text-center space-y-4">
            <h1 class="text-4xl font-bold text-primary">Booking Flow Demo Pages</h1>
            <p class="text-muted-foreground max-w-2xl mx-auto">
              Each page demonstrates a state in the booking workflow using static data wrapped in signals.
              This lets you develop the visual layout without dynamic data, then swap in real signals when ready.
            </p>
          </div>

          <div class="grid gap-4 max-w-3xl mx-auto">
            {demoPages.map((page) => (
              <A 
                href={page.path}
                class="block p-6 border border-primary/20 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-xl font-semibold text-primary mb-2 group-hover:underline">
                      {page.label}
                    </h3>
                    <p class="text-sm text-muted-foreground">{page.description}</p>
                  </div>
                  <svg 
                    class="w-6 h-6 text-primary/50 group-hover:text-primary group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </A>
            ))}
          </div>

          <div class="mt-12 max-w-3xl mx-auto p-6 bg-muted/30 border border-border/20 rounded-lg">
            <h3 class="font-semibold text-primary mb-3">How This Works</h3>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li>• Each page creates local signals with static data</li>
              <li>• Components receive these signals as props</li>
              <li>• The same components can later receive real dynamic signals from BookingPage</li>
              <li>• Use the navigation bar at the top to jump between states</li>
            </ul>
          </div>
        </div>
      </Content>
    </PageFrame>
  );
}

