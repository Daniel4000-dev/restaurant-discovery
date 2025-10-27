export function debounce<T extends (...args: any[]) => any>(
  func: T,      // the function to delay
  wait: number   // how long to wait (e.g. 300 ms)
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function debounced(...args: Parameters<T>) {
    // If the user triggers again before timer expires,
    // clear the previous timer
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Start a new timer
    timeoutId = setTimeout(() => {
      // ⌛ After 'wait' ms with no new calls, run the function
      func(...args);
    }, wait);
  };
}
