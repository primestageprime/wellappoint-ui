import { JSX, For } from 'solid-js';
import { IconWithTitleAndSubtitle } from '../base/IconWithTitleAndSubtitle';
import { ServiceItem } from '../base/ServiceItem';
import { Card } from './Card';
import { H3 } from '../base/H3';
import { Briefcase } from 'lucide-solid';

interface Service {
  name: string;
  description: string;
  icon?: JSX.Element;
}

interface ServicesCardProps {
  services: Service[];
  class?: string;
}

export function ServicesCard(props: ServicesCardProps) {
  return (
    <Card class={props.class}>
      <div class="p-6 space-y-4">
        <H3>Available Services</H3>
        
        <div class="space-y-3">
          <For each={props.services}>
            {(service) => (
              <ServiceItem
                name={service.name}
                description={service.description}
                icon={service.icon}
              />
            )}
          </For>
        </div>
      </div>
    </Card>
  );
}
