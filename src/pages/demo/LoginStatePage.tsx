import { PageFrame, Content } from '../../components/visual';
import { DemoLayout } from './DemoLayout';

export function LoginStatePage() {
  return (
    <DemoLayout>
    <PageFrame>
      <Content>
        <div class="text-center space-y-6 py-12">
          <h1 class="text-3xl font-bold text-primary">Welcome to WellAppoint</h1>
          <p class="text-muted-foreground">Please log in to book your appointment</p>
          
          <button
            onClick={() => console.log('Login clicked')}
            class="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Log In
          </button>
        </div>
      </Content>
    </PageFrame>
    </DemoLayout>
  );
}

