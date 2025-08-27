import { Paper, Card, PageFrame, HeaderCard, Content, Avatar, Split, DesignSystemSection, TestContent, DesignSystemContainer, DesignSystemPage as DesignSystemPageWrapper } from '../components/visual';

export function DesignSystemPage() {
  return (
    <DesignSystemPageWrapper>
      <DesignSystemSection title="Composed Page">
        <PageFrame>
          <HeaderCard>
            <TestContent header="Page Header">
             This HeaderCard contains the page title and navigation elements.
            </TestContent>
          </HeaderCard>
          
          <Content>
              <Card>
                <TestContent header="First Card">
                  This is the first card component within the Content area. It demonstrates how cards work within the main content section.
                </TestContent>
              </Card>
              
              <Card>
                <TestContent header="Second Card">
                This is the second card component within the Content area. It shows how multiple cards can be stacked vertically.
                </TestContent>
              </Card>
          </Content>
        </PageFrame>
      </DesignSystemSection>

      <DesignSystemSection title="Paper Component">
        <Paper>
          <TestContent>
            This is a basic Paper component with default styling. It has a white background, 4px drop shadow, rounded corners, and is horizontally centered with 1rem margin from its parent.
          </TestContent>
        </Paper>
        
        <DesignSystemContainer>
          <Paper class="max-w-md">
            <TestContent>
              This Paper component is inside a container and demonstrates the 1rem margin from its container edge.
            </TestContent>
          </Paper>
        </DesignSystemContainer>
      </DesignSystemSection>

      <DesignSystemSection title="Card Component">
        <Card>
          <TestContent>
            This is a basic Card component with light brown background. It has the same shadow and spacing as Paper but uses the background color for a warmer appearance.
          </TestContent>
        </Card>
        
        <DesignSystemContainer>
          <Card class="max-w-md">
            <TestContent>
              This Card component is inside a container and demonstrates the 1rem margin from its container edge.
            </TestContent>
          </Card>
        </DesignSystemContainer>
      </DesignSystemSection>

      <DesignSystemSection title="PageFrame Component">
        <PageFrame>
          <TestContent>
            This is a basic PageFrame component with white background, 4px drop shadow, rounded corners, and 1rem margin from all edges. It has no internal padding, so content must provide its own padding.
          </TestContent>
        </PageFrame>
      </DesignSystemSection>

      <DesignSystemSection title="HeaderCard Component">
        <PageFrame>
          <HeaderCard>
            <TestContent>
              This is a HeaderCard component with light brown background, rounded top corners, and pointy bottom corners. It has the same shadow and spacing as other components but with header-specific styling.
            </TestContent>
          </HeaderCard>
        </PageFrame>
      </DesignSystemSection>

      <DesignSystemSection title="Content Component">
        <Content>
          <TestContent>
            This is a Content component with the WellAppoint logo and company name. It has a white background, square corners, and 1rem padding. The logo is centered with the company name below it.
          </TestContent>
        </Content>
      </DesignSystemSection>

      <DesignSystemSection title="Avatar Component">
        <Avatar name="Testee McTesterson" />
      </DesignSystemSection>

      <DesignSystemSection title="Split Component">
        <Split 
          left={<TestContent>This is the left side content of the Split component.</TestContent>}
          right={<TestContent>This is the right side content of the Split component.</TestContent>}
        />
      </DesignSystemSection>
    </DesignSystemPageWrapper>
  );
}
