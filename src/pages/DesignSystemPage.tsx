import { Paper, Card, PageFrame, HeaderCard, Content, DesignSystemSection, TestContent, DesignSystemContainer, DesignSystemPage as DesignSystemPageWrapper } from '../components/visual';

export function DesignSystemPage() {
  return (
    <DesignSystemPageWrapper>
      <DesignSystemSection title="Paper Component">
        <Paper>
          <TestContent componentName="Paper" />
        </Paper>
        
        <DesignSystemContainer>
          <Paper class="max-w-md">
            <TestContent componentName="Paper" variant="in-container" />
          </Paper>
        </DesignSystemContainer>
      </DesignSystemSection>

      <DesignSystemSection title="Card Component">
        <Card>
          <TestContent componentName="Card" />
        </Card>
        
        <DesignSystemContainer>
          <Card class="max-w-md">
            <TestContent componentName="Card" variant="in-container" />
          </Card>
        </DesignSystemContainer>
      </DesignSystemSection>

      <DesignSystemSection title="PageFrame Component">
        <PageFrame>
          <TestContent componentName="PageFrame" />
        </PageFrame>
      </DesignSystemSection>

      <DesignSystemSection title="HeaderCard Component">
        <PageFrame>
          <HeaderCard>
            <TestContent componentName="HeaderCard" />
          </HeaderCard>
        </PageFrame>
      </DesignSystemSection>

      <DesignSystemSection title="Content Component">
        <Content>
          <TestContent componentName="Content" />
        </Content>
      </DesignSystemSection>
    </DesignSystemPageWrapper>
  );
}
