import { useState, useEffect } from "react";

/**
 * useDebounce — delays updating the returned value until `delay` ms
 * have passed since the last change to `value`.
 *
 * Usage:
 *   const debouncedQuery = useDebounce(searchInput, 300);
 *   // debouncedQuery only updates 300ms after the user stops typing
 */
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Start a timer — if `value` changes again before it fires, cancel it
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel the previous timer when value/delay changes
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;