import { createSignal } from 'solid-js';
import { For } from 'solid-js';
import { PageFrame, HeaderCard, Content, Avatar, Split, LogoutButton, CenteredContent, H3, H4, TimeItem } from '../../components/visual';
import { AppointmentsCard } from '../../components/AppointmentsCard';
import { DemoLayout } from './DemoLayout';

export function ChooseSlotStatePage() {
  const [username] = createSignal('sokka');

  // Mock available slots grouped by date
  const availableSlots = [
    {
      date: 'Monday, October 20, 2025',
      times: [
        { time: '9:00 AM', available: true },
        { time: '10:30 AM', available: true },
        { time: '2:00 PM', available: true },
        { time: '3:30 PM', available: true }
      ]
    },
    {
      date: 'Tuesday, October 21, 2025',
      times: [
        { time: '8:30 AM', available: true },
        { time: '11:00 AM', available: true },
        { time: '1:00 PM', available: true },
        { time: '4:00 PM', available: true }
      ]
    },
    {
      date: 'Wednesday, October 22, 2025',
      times: [
        { time: '9:30 AM', available: true },
        { time: '12:00 PM', available: true },
        { time: '2:30 PM', available: true }
      ]
    }
  ];

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
        <AppointmentsCard />
        
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <button
              onClick={() => console.log('Back')}
              class="text-primary hover:text-primary/80 text-sm font-medium"
            >
              ← Back to durations
            </button>
          </div>

          <CenteredContent>
            <H3>Select Appointment Time</H3>
            <H4>Choose your preferred date and time</H4>
          </CenteredContent>

          <div class="space-y-8 max-h-96 overflow-y-auto w-full">
            <For each={availableSlots}>
              {(daySlots) => (
                <div class="space-y-4 w-full">
                  <div class="border-b border-primary/20 pb-2">
                    <H4 class="text-xl font-bold text-primary">{daySlots.date}</H4>
                  </div>
                  <div class="flex flex-wrap gap-2 w-full">
                    <For each={daySlots.times}>
                      {(slot) => (
                        <TimeItem
                          time={slot.time}
                          available={slot.available}
                          onClick={() => console.log('Selected time:', slot.time)}
                        />
                      )}
                    </For>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </Content>
    </PageFrame>
    </DemoLayout>
  );
}

