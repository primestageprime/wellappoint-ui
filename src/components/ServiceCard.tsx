import { Heart, Infinity, Footprints, ChevronRight } from 'lucide-solid';

interface ServiceCardProps {
  name: string;
  description: string;
  icon: 'heart' | 'infinity' | 'foot';
  onClick: () => void;
}

const iconMap = {
  heart: Heart,
  infinity: Infinity,
  foot: Footprints
};

export function ServiceCard(props: ServiceCardProps) {
  const IconComponent = iconMap[props.icon];
  
  return (
    <button
      onClick={props.onClick}
      class="w-full h-auto p-6 flex items-center justify-between border border-primary/10 hover:border-primary/30 hover:bg-primary/3 hover:shadow-sm transition-all duration-300 group bg-background text-foreground rounded-md"
    >
      <div class="flex items-center gap-6 text-left">
        <div class="p-4 rounded-full bg-primary/8 group-hover:bg-primary/15 transition-colors duration-300">
          <IconComponent class="w-7 h-7 text-primary" />
        </div>
        <div class="space-y-2">
          <span class="text-xl font-semibold text-primary block">{props.name}</span>
          <span class="text-base text-muted-foreground block">{props.description}</span>
        </div>
      </div>
      <ChevronRight class="w-6 h-6 text-primary/50 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
    </button>
  );
}
