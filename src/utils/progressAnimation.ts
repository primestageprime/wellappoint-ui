/**
 * Animates progress from 0 to 100 over a specified duration
 * @param duration Duration in milliseconds
 * @param onProgress Callback for progress updates (0-100)
 * @param onComplete Callback when animation completes
 * @returns Cleanup function to stop the animation
 */
export function animateProgress(
  duration: number,
  onProgress: (progress: number) => void,
  onComplete: () => void
): () => void {
  const startTime = Date.now();

  const interval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min((elapsed / duration) * 100, 100);
    onProgress(Math.round(progress));

    if (progress >= 100) {
      clearInterval(interval);
      onComplete();
    }
  }, 50);

  // Return cleanup function
  return () => clearInterval(interval);
}
