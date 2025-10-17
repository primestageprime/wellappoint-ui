import { A } from '@solidjs/router';

export function DemoNav() {
  const states = [
    { path: '/demo/components', label: 'COMPONENTS' },
    { path: '/demo/login', label: 'LOGIN' },
    { path: '/demo/choose-service', label: 'CHOOSE SERVICE' },
    { path: '/demo/choose-duration', label: 'CHOOSE DURATION' },
    { path: '/demo/finding-slots', label: 'FINDING SLOTS' },
    { path: '/demo/choose-slot', label: 'CHOOSE SLOT' },
    { path: '/demo/confirm', label: 'CONFIRM' },
    { path: '/demo/processing', label: 'PROCESSING' },
    { path: '/demo/receipt', label: 'RECEIPT' }
  ];

  return (
    <div class="bg-muted/30 border-b border-border/20 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="flex flex-wrap gap-2 items-center justify-center">
          {states.map((state) => (
            <A 
              href={state.path}
              class="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors hover:bg-primary hover:text-primary-foreground"
              activeClass="bg-primary text-primary-foreground"
              inactiveClass="bg-background text-muted-foreground"
            >
              {state.label}
            </A>
          ))}
        </div>
      </div>
    </div>
  );
}

