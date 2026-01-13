/**
 * Task Performance Metrics Tracker
 * Tracks execution times and calculates running averages for async tasks
 */

interface TaskMetric {
  count: number;
  totalTime: number;
  averageTime: number;
}

interface TaskMetrics {
  [taskId: string]: TaskMetric;
}

const STORAGE_KEY = 'wellappoint_task_metrics';
const MAX_STORED_METRICS = 50; // Limit storage size

class TaskMetricsTracker {
  private metrics: TaskMetrics = {};

  constructor() {
    this.loadMetrics();
  }

  private loadMetrics() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.metrics = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load task metrics:', e);
      this.metrics = {};
    }
  }

  private saveMetrics() {
    try {
      // Limit number of stored metrics
      const entries = Object.entries(this.metrics);
      if (entries.length > MAX_STORED_METRICS) {
        // Keep only the most recently updated metrics
        const sorted = entries.sort((a, b) => b[1].count - a[1].count);
        this.metrics = Object.fromEntries(sorted.slice(0, MAX_STORED_METRICS));
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.metrics));
    } catch (e) {
      console.warn('Failed to save task metrics:', e);
    }
  }

  /**
   * Get the average time for a task (in milliseconds)
   */
  getAverageTime(taskId: string): number | null {
    const metric = this.metrics[taskId];
    return metric ? metric.averageTime : null;
  }

  /**
   * Record a completed task execution
   */
  recordTask(taskId: string, durationMs: number) {
    if (!this.metrics[taskId]) {
      this.metrics[taskId] = {
        count: 0,
        totalTime: 0,
        averageTime: 0,
      };
    }

    const metric = this.metrics[taskId];
    metric.count += 1;
    metric.totalTime += durationMs;
    metric.averageTime = metric.totalTime / metric.count;

    this.saveMetrics();
  }

  /**
   * Get all metrics (for debugging)
   */
  getAllMetrics(): TaskMetrics {
    return { ...this.metrics };
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.metrics = {};
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Singleton instance
export const taskMetrics = new TaskMetricsTracker();
