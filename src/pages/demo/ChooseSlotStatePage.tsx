import { createSignal } from 'solid-js';
import { PageFrame, HeaderCard, Content, Avatar, Split, LogoutButton, ServiceSummaryCard, DurationSummaryCard, PrimaryHeart } from '../../components/visual';
import { AppointmentsCard } from '../../components/AppointmentsCard';
import { TimeSlotList } from '../../components/TimeSlotList';
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
        
        <ServiceSummaryCard
          icon={<PrimaryHeart />}
          title="Massage"
          subtitle="Deep tissue & relaxation therapy"
          onEdit={() => console.log('Edit service - unset selection')}
        />
        
        <DurationSummaryCard
          duration={60}
          price={140}
          description="A comprehensive 60-minute full body massage"
          onEdit={() => console.log('Edit duration - back to durations')}
        />
        
        <TimeSlotList 
          slots={availableSlots}
          onSlotSelect={(time) => console.log('Selected time:', time)}
        />
      </Content>
    </PageFrame>
    </DemoLayout>
  );
}

