import { useEffect, useState } from 'react';

export function useDebounce(cb: any, delay: number) {
  const [debounceValue, setDebounceValue] = useState(true);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [cb, delay]);
  return debounceValue;
}
