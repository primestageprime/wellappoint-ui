import { Paper } from '../components/visual';

export function DesignSystemPage() {
  return (
    <div class="min-h-screen bg-background p-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-primary mb-8">Design System</h1>
        
        {/* Paper Component */}
        <section class="mb-12">
          <h2 class="text-2xl font-semibold text-primary mb-4">Paper Component</h2>
          <div class="space-y-4">
            <Paper>
              <div class="p-6">
                <h3 class="text-lg font-medium text-primary mb-2">Basic Paper</h3>
                <p class="text-muted-foreground">
                  This is a basic Paper component with default styling. It has a white background, 
                  drop shadow, rounded corners, and is horizontally centered with 1rem margin from its parent.
                </p>
              </div>
            </Paper>
            
            <Paper class="max-w-md">
              <div class="p-6">
                <h3 class="text-lg font-medium text-primary mb-2">Paper with Custom Width</h3>
                <p class="text-muted-foreground">
                  This Paper component has a custom max-width applied via the class prop.
                </p>
              </div>
            </Paper>
            
            <Paper class="max-w-lg">
              <div class="p-6">
                <h3 class="text-lg font-medium text-primary mb-2">Paper with Larger Width</h3>
                <p class="text-muted-foreground">
                  This Paper component demonstrates how the component can be customized with additional classes 
                  while maintaining its core styling.
                </p>
              </div>
            </Paper>
          </div>
        </section>
      </div>
    </div>
  );
}
