import { useEffect, useState } from 'react';

/**
 * State that loads its initial value once (lazily, on mount) and persists every
 * subsequent change via `save`. Pairs with the load/save accessors in
 * helpers/preferences so each setting is a single line in usePreferences.
 */
export function usePersistedState<T>(load: () => T, save: (value: T) => void): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(load);

  useEffect(() => {
    save(value);
  }, [value, save]);

  return [value, setValue];
}
