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
      class="w-full h-auto p-6 flex items-center justify-between border border-primary/20 hover:border-primary hover:bg-primary/5 hover:shadow-md transition-all duration-300 group bg-background text-foreground rounded-md"
    >
      <div class="flex items-center gap-4 text-left">
        <div class="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
          <IconComponent class="w-6 h-6 text-primary" />
        </div>
        <div class="space-y-1">
          <span class="text-lg text-primary block">{props.name}</span>
          <span class="text-sm text-muted-foreground block">{props.description}</span>
        </div>
      </div>
      <ChevronRight class="w-5 h-5 text-primary/60 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
    </button>
  );
}
