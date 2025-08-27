import { JSX } from 'solid-js';

interface TestContentProps {
  componentName: string;
  variant?: 'basic' | 'in-container';
  class?: string;
}

export function TestContent(props: TestContentProps) {
  const getTitle = () => {
    if (props.variant === 'in-container') {
      return `${props.componentName} in Container`;
    }
    return `Basic ${props.componentName}`;
  };

  const getDescription = () => {
    const descriptions = {
      'Paper': {
        basic: 'This is a basic Paper component with default styling. It has a white background, 4px drop shadow, rounded corners, and is horizontally centered with 1rem margin from its parent.',
        'in-container': 'This Paper component is inside a container and demonstrates the 1rem margin from its container edge.'
      },
      'Card': {
        basic: 'This is a basic Card component with light brown background. It has the same shadow and spacing as Paper but uses the background color for a warmer appearance.',
        'in-container': 'This Card component is inside a container and demonstrates the 1rem margin from its container edge.'
      },
      'PageFrame': {
        basic: 'This is a basic PageFrame component with white background, 4px drop shadow, rounded corners, and 1rem margin from all edges. It has no internal padding, so content must provide its own padding.',
        'in-container': 'This PageFrame component is inside a container and demonstrates the 1rem margin from its container edge. Notice how the content inside provides its own padding since PageFrame has no internal padding.'
      },
      'HeaderCard': {
        basic: 'This is a HeaderCard component with light brown background, rounded top corners, and pointy bottom corners. It has the same shadow and spacing as other components but with header-specific styling.',
        'in-container': 'This HeaderCard component is inside a container and demonstrates the 1rem margin from its container edge.'
      }
    };

    const componentDesc = descriptions[props.componentName as keyof typeof descriptions];
    if (!componentDesc) {
      return `This is a ${props.componentName} component.`;
    }

    return componentDesc[props.variant || 'basic'];
  };

  const getTextColor = () => {
    if (props.componentName === 'Card' || props.componentName === 'HeaderCard') {
      return 'text-card-foreground';
    }
    return 'text-primary';
  };

  return (
    <div class={`p-6 ${props.class || ''}`}>
      <h3 class={`text-lg font-medium ${getTextColor()} mb-2`}>{getTitle()}</h3>
      <p class="text-muted-foreground">
        {getDescription()}
      </p>
    </div>
  );
}
