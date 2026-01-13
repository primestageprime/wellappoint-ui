import { createSignal } from 'solid-js';
import { PageFrame, HeaderCard, Content, Avatar, Split, LogoutButton, ProgressButton } from '../../components/visual';
import { DemoLayout } from './DemoLayout';

export function ProgressButtonDemoPage() {
  const [username] = createSignal('demo');

  // State for first button - linear 10 second animation
  const [isLoading, setIsLoading] = createSignal(false);
  const [isSuccess, setIsSuccess] = createSignal(false);

  const handleProgressButtonClick = () => {
    setIsLoading(true);
    setIsSuccess(false);

    // Simulate 10 second async operation
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      // Reset after showing success for 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }, 10000);
  };

  // State for second button - fixed at 50% progress
  const [isLoading2] = createSignal(true);
  const [isSuccess2] = createSignal(false);
  const [progress2] = createSignal(50);

  // State for third button - success state
  const [isLoading3] = createSignal(false);
  const [isSuccess3] = createSignal(true);

  // State for fourth button - interactive demo with controls
  const [demoStatus, setDemoStatus] = createSignal<'idle' | 'loading' | 'success'>('idle');
  const [demoProgress, setDemoProgress] = createSignal(0);

  const handleInteractiveButtonClick = () => {
    setDemoStatus('loading');
    setDemoProgress(0);

    // Animate progress to 100% over 10 seconds
    const startTime = Date.now();
    const duration = 10000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setDemoProgress(Math.round(progress));

      if (progress >= 100) {
        clearInterval(interval);
        setDemoStatus('success');

        // Reset after 3 seconds
        setTimeout(() => {
          setDemoStatus('idle');
          setDemoProgress(0);
        }, 3000);
      }
    }, 50);
  };

  return (
    <DemoLayout>
      <PageFrame>
        <HeaderCard>
          <Split
            left={<Avatar username={username} />}
            right={<LogoutButton onLogout={() => console.log('Logout')}>Logout</LogoutButton>}
          />
        </HeaderCard>

        <Content>
          <div class="max-w-md mx-auto space-y-8 py-12">
            <div class="text-center">
              <h2 class="text-2xl font-bold text-primary mb-2">ProgressButton Component</h2>
              <p class="text-muted-foreground">
                Click to see the button animate progress linearly over 10 seconds, then fade to green
              </p>
            </div>

            <ProgressButton
              text="Submit Form"
              loadingText="Processing..."
              successText="Success!"
              isLoading={isLoading()}
              isSuccess={isSuccess()}
              taskId="demo-task"
              type="button"
              onClick={handleProgressButtonClick}
            />

            <ProgressButton
              text="Submitting..."
              loadingText="Processing..."
              successText="Success!"
              isLoading={isLoading2()}
              isSuccess={isSuccess2()}
              taskId="demo-task-2"
              type="button"
              fixedProgress={progress2()}
            />

            <ProgressButton
              text="Complete"
              loadingText="Processing..."
              successText="Success!"
              isLoading={isLoading3()}
              isSuccess={isSuccess3()}
              taskId="demo-task-3"
              type="button"
            />

            <div class="border-t border-primary/20 pt-8">
              <h3 class="text-xl font-semibold text-primary mb-4">Interactive Demo</h3>

              <div class="space-y-4 mb-6 bg-card p-6 rounded-lg">
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Status: <span class="text-primary font-semibold">{demoStatus()}</span>
                  </label>
                  <div class="flex gap-2">
                    <button
                      class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      classList={{
                        'bg-primary text-white': demoStatus() === 'idle',
                        'bg-muted text-foreground': demoStatus() !== 'idle'
                      }}
                      onClick={() => setDemoStatus('idle')}
                    >
                      Idle
                    </button>
                    <button
                      class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      classList={{
                        'bg-primary text-white': demoStatus() === 'loading',
                        'bg-muted text-foreground': demoStatus() !== 'loading'
                      }}
                      onClick={() => setDemoStatus('loading')}
                    >
                      Loading
                    </button>
                    <button
                      class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      classList={{
                        'bg-primary text-white': demoStatus() === 'success',
                        'bg-muted text-foreground': demoStatus() !== 'success'
                      }}
                      onClick={() => setDemoStatus('success')}
                    >
                      Success
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Progress: <span class="text-primary font-semibold">{demoProgress()}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={demoProgress()}
                    onInput={(e) => setDemoProgress(parseInt(e.currentTarget.value))}
                    class="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                    style={{
                      'accent-color': '#8B6914'
                    }}
                  />
                </div>
              </div>

              <ProgressButton
                text="Interactive Button"
                loadingText="Processing..."
                successText="Success!"
                isLoading={demoStatus() === 'loading'}
                isSuccess={demoStatus() === 'success'}
                taskId="demo-task-interactive"
                type="button"
                fixedProgress={demoProgress()}
                onClick={handleInteractiveButtonClick}
              />
            </div>
          </div>
        </Content>
      </PageFrame>
    </DemoLayout>
  );
}
