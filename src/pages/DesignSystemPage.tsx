import { Paper, Card, PageFrame, DesignSystemSection, TestContent } from '../components/visual';

export function DesignSystemPage() {
  return (
    <div class="min-h-screen bg-background p-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-primary mb-8">Design System</h1>
        
        <DesignSystemSection title="Paper Component">
          <Paper>
            <TestContent componentName="Paper" />
          </Paper>
          
          {/* Container for second example */}
          <div class="bg-muted p-4 rounded-lg">
            <Paper class="max-w-md">
              <TestContent componentName="Paper" variant="in-container" />
            </Paper>
          </div>
        </DesignSystemSection>

        <DesignSystemSection title="Card Component">
          <Card>
            <TestContent componentName="Card" />
          </Card>
          
          {/* Container for second example */}
          <div class="bg-muted p-4 rounded-lg">
            <Card class="max-w-md">
              <TestContent componentName="Card" variant="in-container" />
            </Card>
          </div>
        </DesignSystemSection>

        <DesignSystemSection title="PageFrame Component">
          <PageFrame>
            <TestContent componentName="PageFrame" />
          </PageFrame>
        </DesignSystemSection>
      </div>
    </div>
  );
}
