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
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <For each={props.durations}>
          {(duration) => (
            <div class="bg-[#faf8f5] rounded-xl p-5 border border-[#8B6914]/10 max-w-md">
              {/* Duration & Price Header */}
              <div class="flex justify-between items-start mb-4">
                <div>
                  <div class="text-xs text-[#5a4510] mb-1">Duration</div>
                  <div class="text-xl text-[#8B6914] font-medium">{duration.duration} min</div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-[#5a4510] mb-1">Price</div>
                  <div class="text-xl text-[#8B6914] font-medium">${duration.price}</div>
                </div>
              </div>
              
              {/* Description */}
              <Show when={duration.description}>
                <div class="border-t border-gray-200 pt-4 mb-4">
                  <div class="text-xs text-[#5a4510] mb-2">Description</div>
                  <div class="text-sm text-[#3d2e0a] leading-relaxed">{duration.description}</div>
                </div>
              </Show>
              
              {/* Prep & Cleanup Container */}
              <Show when={duration.prep || duration.cleanup}>
                <div class="flex flex-col sm:flex-row gap-3">
                  {/* Prep */}
                  <Show when={duration.prep}>
                    <div class="bg-gray-100 rounded-lg p-3 flex-1">
                      <div class="flex justify-between items-center mb-3">
                        <span class="text-sm font-medium text-[#5a4510]">Prep</span>
                        <span class="text-sm text-[#8B6914]">{duration.prep!.time} min</span>
                      </div>
                      <ul class="text-sm text-[#3d2e0a] space-y-1">
                        <For each={duration.prep!.steps}>
                          {(step) => <li class="flex items-start"><span class="mr-2">•</span><span>{step}</span></li>}
                        </For>
                      </ul>
                    </div>
                  </Show>
                  
                  {/* Cleanup */}
                  <Show when={duration.cleanup}>
                    <div class="bg-gray-100 rounded-lg p-3 flex-1">
                      <div class="flex justify-between items-center mb-3">
                        <span class="text-sm font-medium text-[#5a4510]">Cleanup</span>
                        <span class="text-sm text-[#8B6914]">{duration.cleanup!.time} min</span>
                      </div>
                      <ul class="text-sm text-[#3d2e0a] space-y-1">
                        <For each={duration.cleanup!.steps}>
                          {(step) => <li class="flex items-start"><span class="mr-2">•</span><span>{step}</span></li>}
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

