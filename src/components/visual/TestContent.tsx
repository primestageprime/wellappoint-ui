import { JSX } from 'solid-js';

interface TestContentProps {
  componentName: string;
  variant?: string;
}

export function TestContent(props: TestContentProps) {
  const getContent = () => {
    switch (props.componentName) {
      case 'Paper':
        return props.variant === 'in-container' 
          ? "This Paper component is inside a container and demonstrates the 1rem margin from its container edge."
          : "This is a basic Paper component with default styling. It has a white background, 4px drop shadow, rounded corners, and is horizontally centered with 1rem margin from its parent.";
      case 'Card':
        return props.variant === 'in-container'
          ? "This Card component is inside a container and demonstrates the 1rem margin from its container edge."
          : "This is a basic Card component with light brown background. It has the same shadow and spacing as Paper but uses the background color for a warmer appearance.";
      case 'PageFrame':
        return "This is a basic PageFrame component with white background, 4px drop shadow, rounded corners, and 1rem margin from all edges. It has no internal padding, so content must provide its own padding.";
      case 'HeaderCard':
        return "This is a HeaderCard component with light brown background, rounded top corners, and pointy bottom corners. It has the same shadow and spacing as other components but with header-specific styling.";
      case 'Content':
        return "This is a Content component with the WellAppoint logo and company name. It has a white background, square corners, and 1rem padding. The logo is centered with the company name below it.";
      default:
        return "This is a component with default styling.";
    }
  };

  const getTextColor = () => {
    switch (props.componentName) {
      case 'HeaderCard':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <p class={`${getTextColor()} leading-6`}>
      {getContent()}
    </p>
  );
}
