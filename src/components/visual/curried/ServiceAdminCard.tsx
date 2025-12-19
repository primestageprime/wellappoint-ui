import { For, Show } from 'solid-js';

interface DurationOption {
  duration: number;
  price: number;
  description: string;
  prep?: { time: number; steps: string[] };
  cleanup?: { time: number; steps: string[] };
}

interface ServiceAdminCardProps {
  name: string;
  durations: DurationOption[];
}

export function ServiceAdminCard(props: ServiceAdminCardProps) {
  return (
    <div class="bg-white rounded-lg border border-[#8B6914]/20 shadow-sm p-6 mb-4">
      <h3 class="text-base font-semibold text-[#8B6914] uppercase tracking-wide mb-4">
        {props.name}
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <For each={props.durations}>
          {(duration) => (
            <div class="bg-[#faf8f5] rounded-lg p-4 border border-[#8B6914]/10">
              {/* Duration & Price Header */}
              <div class="flex justify-between items-start mb-3 pb-3 border-b border-[#8B6914]/10">
                <div>
                  <div class="text-xs text-[#5a4510] font-medium">Duration</div>
                  <div class="text-lg text-[#8B6914] font-semibold">{duration.duration} min</div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-[#5a4510] font-medium">Price</div>
                  <div class="text-lg text-[#8B6914] font-semibold">${duration.price}</div>
                </div>
              </div>
              
              {/* Description */}
              <Show when={duration.description}>
                <div class="mb-3">
                  <div class="text-xs text-[#5a4510] font-medium mb-1">Description</div>
                  <div class="text-sm text-[#3d2e0a]">{duration.description}</div>
                </div>
              </Show>
              
              {/* Prep & Cleanup */}
              <Show when={duration.prep || duration.cleanup}>
                <div class="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#8B6914]/10">
                  <Show when={duration.prep}>
                    <div class="bg-white rounded p-2">
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-xs font-medium text-[#5a4510]">Prep</span>
                        <span class="text-xs text-[#8B6914]">{duration.prep!.time} min</span>
                      </div>
                      <ul class="text-xs text-[#3d2e0a] space-y-1">
                        <For each={duration.prep!.steps}>
                          {(step) => <li>• {step}</li>}
                        </For>
                      </ul>
                    </div>
                  </Show>
                  
                  <Show when={duration.cleanup}>
                    <div class="bg-white rounded p-2">
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-xs font-medium text-[#5a4510]">Cleanup</span>
                        <span class="text-xs text-[#8B6914]">{duration.cleanup!.time} min</span>
                      </div>
                      <ul class="text-xs text-[#3d2e0a] space-y-1">
                        <For each={duration.cleanup!.steps}>
                          {(step) => <li>• {step}</li>}
                        </For>
                      </ul>
                    </div>
                  </Show>
                </div>
              </Show>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

