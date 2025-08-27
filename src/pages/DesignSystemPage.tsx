import { Paper, Card, PageFrame, HeaderCard, Content, Avatar, Split, LogoutButton, WellAppointLogo, DesignSystemSection, TestContent, DesignSystemContainer, DesignSystemPage as DesignSystemPageWrapper, ProviderContent, IconWithText, TightIconWithText, LooseIconWithText, BriefcaseWithText, TightBriefcaseWithText, LooseBriefcaseWithText, SmallText } from '../components/visual';
import { Briefcase } from 'lucide-solid';

export function DesignSystemPage() {
  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <DesignSystemPageWrapper>
      <DesignSystemSection title="Composed Page">
        <PageFrame>
          <HeaderCard>
            <Split 
              left={<Avatar name="Testee McTesterson" />}
              right={<LogoutButton onLogout={handleLogout}>Logout</LogoutButton>}
            />
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

      <DesignSystemSection title="LogoutButton Component">
        <LogoutButton onLogout={handleLogout}>Logout</LogoutButton>
      </DesignSystemSection>

      <DesignSystemSection title="WellAppointLogo Component">
        <div class="flex flex-col items-center space-y-6">
          <div>
            <h3 class="text-lg font-medium text-primary mb-2">Favicon Size (16px)</h3>
            <WellAppointLogo className="text-primary" size={16} />
          </div>
          <div>
            <h3 class="text-lg font-medium text-primary mb-2">Page Heading Size (48px)</h3>
            <WellAppointLogo className="text-primary" size={48} />
          </div>
        </div>
      </DesignSystemSection>

      <DesignSystemSection title="ProviderContent Component">
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-medium text-primary mb-2">With Profile Picture</h3>
            <Card>
              <ProviderContent 
                name="Dr. Katara Waterbender"
                email="katara@southernwatertribe.gov"
                title="Water Healing Specialist"
                profilePic="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
              />
            </Card>
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-primary mb-2">With Fallback Avatar</h3>
            <Card>
              <ProviderContent 
                name="Dr. Aang Avatar"
                email="aang@airtemple.org"
                title="Air Nomad Healer"
              />
            </Card>
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-primary mb-2">Long Text Handling</h3>
            <Card>
              <ProviderContent 
                name="Dr. Toph Beifong Earthbending Master and Metalbending Pioneer"
                email="verylongemailaddress@extremelylongdomainname.com"
                title="Earth Kingdom's Most Distinguished Metalbending Specialist and Seismic Sense Expert"
              />
            </Card>
          </div>
        </div>
      </DesignSystemSection>

      <DesignSystemSection title="IconWithText Component">
        <div class="space-y-4">
          <Card>
            <div class="p-6 space-y-4">
              <TightBriefcaseWithText>
                <SmallText>Your Text here (gap-2)</SmallText>
              </TightBriefcaseWithText>
              
              <BriefcaseWithText>
                <SmallText>Your Text here (gap-4)</SmallText>
              </BriefcaseWithText>
              
              <LooseBriefcaseWithText>
                <SmallText>Your Text here (gap-8)</SmallText>
              </LooseBriefcaseWithText>
            </div>
          </Card>
        </div>
      </DesignSystemSection>
    </DesignSystemPageWrapper>
  );
}
