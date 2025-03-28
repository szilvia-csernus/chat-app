import { useRef, useEffect } from "react";

export function useDebounce(func: Function, delay: number, immediate = true) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFunction = (...args: any[]) => {
    const callNow = immediate && !timerRef.current;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = null; // Reset the timer after execution
      if (!immediate) {
        func(...args); // Execute the function if not immediate
      }
    }, delay);

    if (callNow) {
      func(...args); // Execute the function immediately if `immediate` is true
    }
  };

  // Cleanup the timer on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return debouncedFunction;
}