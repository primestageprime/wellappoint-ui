import { Card } from './Card';

export function AppointmentsCard() {
  // Stub data for now
  const appointments = [
    {
      service: 'Therapeutic Massage',
      duration: '60 minutes',
      date: '8/27/2025 at 2:00 PM'
    }
  ];

  return (
    <div class="bg-card border border-border/20 rounded-lg shadow-sm mb-6">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-card-foreground mb-4">
          Your Appointments
        </h3>
        
        {appointments.length === 0 ? (
          <div class="text-center py-4">
            <p class="text-muted-foreground">No upcoming appointments</p>
          </div>
        ) : (
          <div class="space-y-3">
            {appointments.map((appointment, index) => (
              <div class="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                <div class="flex-1">
                  <p class="text-card-foreground font-medium">{appointment.service}</p>
                  <p class="text-sm text-muted-foreground">
                    {appointment.duration} • {appointment.date}
                  </p>
                </div>
                <div class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {index + 1}/{appointments.length}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
