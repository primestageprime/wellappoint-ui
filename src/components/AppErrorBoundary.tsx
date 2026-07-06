import { ErrorBoundary, type JSX } from 'solid-js';
import { PageFrame, CenteredContent, H3, SmallText, StandardButton } from './visual';

interface AppErrorBoundaryProps {
  children: JSX.Element;
  /** Short label describing what failed, e.g. "this page". Defaults to "the app". */
  scope?: string;
}

/**
 * Wraps a subtree so a render/runtime error inside it is caught and shown as a
 * recoverable fallback instead of tearing down the whole app (blank screen).
 *
 * `reset` re-runs the failed subtree; it recovers from transient errors. A
 * "Reload page" escape hatch is offered for errors that persist across a reset.
 */
export function AppErrorBoundary(props: AppErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={(error: unknown, reset: () => void) => {
        // Surface the underlying error for debugging — the UI intentionally
        // hides the raw message from end users.
        console.error('Render error caught by AppErrorBoundary:', error);

        const message =
          error instanceof Error ? error.message : String(error ?? 'Unknown error');

        return (
          <div class="p-4">
            <PageFrame>
              <CenteredContent class="space-y-4 p-8">
                <H3>Something went wrong</H3>
                <SmallText class="text-primary/70">
                  We hit an unexpected problem loading {props.scope || 'the app'}.
                  You can try again, or reload the page.
                </SmallText>

                <details class="w-full text-left">
                  <summary class="cursor-pointer text-sm text-primary/60">
                    Error details
                  </summary>
                  <pre class="mt-2 whitespace-pre-wrap break-words rounded-md bg-destructive/10 p-3 text-xs text-destructive">
                    {message}
                  </pre>
                </details>

                <div class="flex gap-3">
                  <StandardButton variant="primary" onClick={reset}>
                    Try again
                  </StandardButton>
                  <StandardButton
                    variant="outline"
                    onClick={() => window.location.reload()}
                  >
                    Reload page
                  </StandardButton>
                </div>
              </CenteredContent>
            </PageFrame>
          </div>
        );
      }}
    >
      {props.children}
    </ErrorBoundary>
  );
}
