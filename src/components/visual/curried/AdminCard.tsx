import { JSX } from 'solid-js';

interface AdminCardProps {
  title: string;
  children: JSX.Element;
}

export function AdminCard(props: AdminCardProps) {
  return (
    <div class="bg-white rounded-lg border border-[#8B6914]/20 shadow-sm p-6">
      <h2 class="text-lg font-semibold text-[#3d2e0a] mb-4">{props.title}</h2>
      {props.children}
    </div>
  );
}

