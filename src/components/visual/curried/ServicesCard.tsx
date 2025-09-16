import { For, Show } from 'solid-js';  
import { ServiceItem } from './ServiceItem';
import { Card } from './Card';
import { H3 } from '../base/H3';
import { type UIService } from '../../../types/service';

interface ServicesCardProps {
  services: UIService[];
  title?: string;
  class?: string;
}

export function ServicesCard(props: ServicesCardProps) {
  return (
    <Show when={props.services && props.services.length > 0}>
    <Card class={props.class}>
      <div class="p-6 space-y-4">
        {props.title && <H3>{props.title}</H3>}
        
        <div class="space-y-3">
          <For each={props.services}>
            {(service) => {
              console.log('Rendering service:', service.name, 'with onClick:', !!service.onClick);
              return (
                <ServiceItem
                  name={service.name}
                  description={service.subtitle || service.description}
                  icon={service.icon}
                  onClick={service.onClick}
                />
              );
            }}
          </For>
        </div>
      </div>
    </Card>
    </Show>
  );
}
