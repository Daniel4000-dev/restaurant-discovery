// src/hooks/useRenderTracker.ts
import { useEffect, useRef } from 'react';
import { trackRenderTime } from '@/utils/analytics';

/**
 * Tracks the render time of a component.
 * @param componentName - Name of the component to identify in analytics.
 */
export function useRenderTracker(componentName: string) {
  const start = useRef(performance.now());

  useEffect(() => {
    const end = performance.now();
    trackRenderTime(componentName, end - start.current);
  }, [componentName]);
}
