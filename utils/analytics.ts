interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

class PerformanceAnalytics {
  private metrics: PerformanceMetric[] = [];
  private startTimes: Map<string, number> = new Map();

  startMeasure(name: string): void {
    this.startTimes.set(name, Date.now());
  }

  endMeasure(name: string, metadata?: Record<string, unknown>): void {
    const startTime = this.startTimes.get(name);
    if (!startTime) {
      console.warn(`No start time found for metric: ${name}`);
      return;
    }

    const value = Date.now() - startTime;
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
      metadata,
    });

    this.startTimes.delete(name);

    console.log(`[Performance] ${name}: ${value}ms`, metadata || '');
  }

  recordMetric(name: string, value: number, metadata?: Record<string, unknown>): void {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
      metadata,
    });
    console.log(`[Metric] ${name}: ${value}`, metadata || '');
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getAverageMetric(name: string): number {
    const filteredMetrics = this.metrics.filter((m) => m.name === name);
    if (filteredMetrics.length === 0) return 0;

    const sum = filteredMetrics.reduce((acc, m) => acc + m.value, 0);
    return sum / filteredMetrics.length;
  }

  clearMetrics(): void {
    this.metrics = [];
    this.startTimes.clear();
  }

  getReport(): string {
    const grouped = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = [];
      }
      acc[metric.name].push(metric.value);
      return acc;
    }, {} as Record<string, number[]>);

    let report = 'Performance Report\n=================\n\n';

    Object.entries(grouped).forEach(([name, values]) => {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      report += `${name}:\n`;
      report += `  Average: ${avg.toFixed(2)}ms\n`;
      report += `  Min: ${min.toFixed(2)}ms\n`;
      report += `  Max: ${max.toFixed(2)}ms\n`;
      report += `  Count: ${values.length}\n\n`;
    });

    return report;
  }
}

export const analytics = new PerformanceAnalytics();

export function trackRenderTime(componentName: string, renderTime: number): void {
  analytics.recordMetric(`render_${componentName}`, renderTime);
}

export function trackApiCall(endpoint: string, duration: number, success: boolean): void {
  analytics.recordMetric(`api_${endpoint}`, duration, { success });
}

export function trackUserAction(action: string, metadata?: Record<string, unknown>): void {
  analytics.recordMetric(`user_${action}`, Date.now(), metadata);
}

export function getPerformanceReport(): string {
  return analytics.getReport();
}