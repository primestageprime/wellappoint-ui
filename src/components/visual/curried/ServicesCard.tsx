import { JSX, For } from 'solid-js';
import { IconWithTitleAndSubtitle } from '../base/IconWithTitleAndSubtitle';
import { ServiceItem } from './ServiceItem';
import { Card } from './Card';
import { H3 } from '../base/H3';
import { Heart, Craniosacral, FootReflexology } from '../icons';

interface Service {
  name: string;
  description: string;
  subtitle?: string;
  icon?: JSX.Element;
  onClick?: () => void;
}

interface ServicesCardProps {
  services: Service[];
  title?: string;
  class?: string;
}

export function ServicesCard(props: ServicesCardProps) {
  return (
    <Card class={props.class}>
      <div class="p-6 space-y-4">
        {props.title && <H3>{props.title}</H3>}
        
        <div class="space-y-3">
          <For each={props.services}>
            {(service) => (
              <ServiceItem
                name={service.name}
                description={service.subtitle || service.description}
                icon={service.icon}
                onClick={service.onClick}
              />
            )}
          </For>
        </div>
      </div>
    </Card>
  );
}
