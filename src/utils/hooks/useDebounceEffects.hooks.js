import { noop } from 'lodash';
import { useEffect } from 'react';

export function useDebounceEffect(fn = noop, waitTime = 0, deps = []) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn(...deps);
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, [fn, waitTime, deps]);
}
