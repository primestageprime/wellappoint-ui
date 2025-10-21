/**
 * @deprecated This component uses a data-driven anti-pattern.
 * Use ServicesContainer with composed ServiceItem components instead.
 * See ProviderBookingPage for the new pattern.
 */

import { For, Show } from 'solid-js';  
import { ServiceItem } from './ServiceItem';
import { Card } from './Card';
import { H3 } from '../base/H3';
import { type ServicesCardProps } from '../../../types/visual';

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
