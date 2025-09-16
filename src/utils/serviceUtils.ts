import { type BookingService } from '../types/service';

export const annotateOnClick = (setSelectedService: (service: string) => void, services: BookingService[]) => {
  return services.map(service => ({
    ...service,
    onClick: () => setSelectedService(service.name)
  }));
};