import { Paper, Card, PageFrame, HeaderCard, Content, Avatar, Split, LogoutButton, WellAppointLogo, DesignSystemSection, TestContent, DesignSystemContainer, DesignSystemPage as DesignSystemPageWrapper, ProviderContent, AppointmentsCard, ServicesCard, DurationList, DurationItem, IconWithText, IconWithTitleAndSubtitle, ServiceItem, SmallText, SectionHeading, Briefcase, CenteredContent, H3, H4, Heart, Craniosacral, FootReflexology, VerticallySpacedContent, PrimaryHeart, PrimaryCraniosacral, PrimaryFootReflexology, ServiceSummaryCard, AppointmentDetailsGrid, ActionButtons, SessionDescription, StandardButton } from '../components/visual';

export function DesignSystemPage() {
  const handleLogout = () => {
    console.log('Logout clicked');
  };
const provider = {
  name: "Dr. Katara Waterbender",
  email: "katara@southernwatertribe.gov",
  title: "Water Healing Specialist",
  profilePic: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
}
  const appointments = [
    {
      service: "Therapeutic Massage",
      duration: "60 minutes",
      date: "8/27/2025",
      time: "2:00 PM"
    },
    {
      service: "Energy Healing Session",
      duration: "45 minutes",
      date: "8/29/2025",
      time: "10:00 AM"
    }
  ]

  const services = [

    {
      name: "Therapeutic Massage",
      description: "Deep tissue & relaxation therapy",
      icon: <PrimaryHeart />,
    },
    {
      name: "Craniosacral Therapy",
      description: "Gentle energy work & alignment",
      icon: <PrimaryCraniosacral />,
    },
    
    {
      name: "Foot Reflexology",
      description: "Pressure point healing",
      icon: <PrimaryFootReflexology />,
    }
  ]

  const durations = [
    {
      duration: "30 minutes",
      description: "A gentle 30-minute massage using organic oils to release tension and restore balance.",
      price: "$85",
      icon: <PrimaryHeart />
    },
    {
      duration: "60 minutes", 
      description: "A comprehensive 60-minute full body massage with essential oils and healing crystals.",
      price: "$140",
      icon: <PrimaryHeart />
    },
    {
      duration: "90 minutes",
      description: "Extended 90-minute deep healing session with aromatherapy, crystal therapy, and chakra balancing.",
      price: "$190",
      icon: <PrimaryHeart />
    }
  ]

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
              <ProviderContent 
                name={provider.name}
                email={provider.email}
                title={provider.title}
                profilePic={provider.profilePic}
              />
            </Card>
            
            <AppointmentsCard 
              appointments={appointments}
            />

            <CenteredContent>
              <H3>Choose Your Healing Journey</H3>
              <H4>Select a service to continue</H4>
            </CenteredContent>
            <ServicesCard
              services={services}
            />
          </Content>
        </PageFrame>
      </DesignSystemSection>

      <DesignSystemSection title="Paper Component">
        <Paper>
          <TestContent>
            This is a basic Paper component with default styling. It has a white background, 4px drop shadow, rounded corners, and is horizontally centered with 1rem margin from its parent.
          </TestContent>
        </Paper>
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
            <SectionHeading>With Profile Picture</SectionHeading>
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
            <SectionHeading>With Fallback Avatar</SectionHeading>
            <Card>
              <ProviderContent 
                name="Dr. Aang Avatar"
                email="aang@airtemple.org"
                title="Air Nomad Healer"
              />
            </Card>
          </div>
          
          <div>
            <SectionHeading>Long Text Handling</SectionHeading>
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
        <Card>
          <IconWithText icon={<Briefcase />}>
            <SmallText>Your Text here</SmallText>
          </IconWithText>
        </Card>
      </DesignSystemSection>

      <DesignSystemSection title="IconWithTitleAndSubtitle Component">
        <IconWithTitleAndSubtitle
          icon={<PrimaryHeart />}
          title="Therapeutic Massage"
          subtitle="Deep tissue & relaxation therapy"
        />
        
        <IconWithTitleAndSubtitle
          icon={<PrimaryCraniosacral />}
          title="Craniosacral Therapy"
          subtitle="Gentle energy work & alignment"
        />
        
        <IconWithTitleAndSubtitle
          icon={<PrimaryFootReflexology />}
          title="Foot Reflexology"
          subtitle="Pressure point healing"
        />
      </DesignSystemSection>

      <DesignSystemSection title="ServicesCard Component">
        <ServicesCard 
          services={[
            {
              name: "Therapeutic Massage",
              description: "Deep tissue & relaxation therapy",
              icon: <PrimaryHeart />,
              onClick: () => console.log('Therapeutic Massage selected')
            },
            {
              name: "Craniosacral Therapy",
              description: "Gentle energy work & alignment",
              icon: <PrimaryCraniosacral />,
              onClick: () => console.log('Craniosacral Therapy selected')
            },
            {
              name: "Foot Reflexology",
              description: "Pressure point healing",
              icon: <PrimaryFootReflexology />,
              onClick: () => console.log('Foot Reflexology selected')
            }
          ]}
        />
      </DesignSystemSection>

      <DesignSystemSection title="DurationItem Component">
        <DurationItem
          duration="30 minutes"
          description="A gentle 30-minute massage using organic oils to release tension and restore balance."
          price="$85"
          onClick={() => console.log('30 minutes selected')}
        />
        
        <DurationItem
          duration="60 minutes"
          description="A comprehensive 60-minute full body massage with essential oils and healing crystals."
          price="$140"
          onClick={() => console.log('60 minutes selected')}
        />
        
        <DurationItem
          duration="90 minutes"
          description="Extended 90-minute deep healing session with aromatherapy, crystal therapy, and chakra balancing."
          price="$190"
          onClick={() => console.log('90 minutes selected')}
        />
      </DesignSystemSection>

      <DesignSystemSection title="DurationList Component">
        <DurationList 
          title="Select Session Duration"
          durations={durations}
        />
      </DesignSystemSection>

      <DesignSystemSection title="ServiceSummaryCard Component">
        <ServiceSummaryCard
          icon={<PrimaryHeart />}
          title="Therapeutic Massage"
          subtitle="Deep tissue & relaxation therapy"
        />
      </DesignSystemSection>

      <DesignSystemSection title="AppointmentDetailsGrid Component">
        <AppointmentDetailsGrid
          details={[
            {
              label: 'Date & Time',
              value: 'Thursday, August 28, 2025 at 4:55 PM'
            },
            {
              label: 'Duration',
              value: '30 minutes'
            },
            {
              label: 'Location',
              value: 'OFFICE'
            },
            {
              label: 'Exchange',
              value: '$100'
            }
          ]}
        />
      </DesignSystemSection>

      <DesignSystemSection title="SessionDescription Component">
        <SessionDescription 
          description="A gentle back and shoulder massage using organic oils to release tension and restore balance."
        />
      </DesignSystemSection>

      <DesignSystemSection title="StandardButton Component">
        <div class="space-y-4">
          <div class="flex gap-4">
            <StandardButton variant="primary" onClick={() => console.log('Primary clicked')}>
              Primary Button
            </StandardButton>
            <StandardButton variant="secondary" onClick={() => console.log('Secondary clicked')}>
              Secondary Button
            </StandardButton>
            <StandardButton variant="outline" onClick={() => console.log('Outline clicked')}>
              Outline Button
            </StandardButton>
          </div>
          <div class="flex gap-4">
            <StandardButton size="sm" variant="primary" onClick={() => console.log('Small clicked')}>
              Small
            </StandardButton>
            <StandardButton size="md" variant="primary" onClick={() => console.log('Medium clicked')}>
              Medium
            </StandardButton>
            <StandardButton size="lg" variant="primary" onClick={() => console.log('Large clicked')}>
              Large
            </StandardButton>
          </div>
        </div>
      </DesignSystemSection>

      <DesignSystemSection title="ActionButtons Component">
        <ActionButtons
          buttons={[
            {
              text: 'Back',
              onClick: () => console.log('Back clicked'),
              variant: 'secondary'
            },
            {
              text: 'Confirm Your Sacred Session',
              onClick: () => console.log('Confirm clicked'),
              variant: 'primary'
            }
          ]}
        />
      </DesignSystemSection>
    </DesignSystemPageWrapper>
  );
}
