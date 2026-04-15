import { useCallback, useMemo, useState } from "react";

function readStoredValue(storageKey: string): boolean | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored === null ? null : stored === "true";
  } catch {
    return null;
  }
}

function writeStoredValue(storageKey: string, value: boolean): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, String(value));
  } catch {
    // Storage access is optional; keep the UI functional even when persistence is blocked.
  }
}

export function usePersistedToolState(messageId: string, defaultValue: boolean) {
  const storageKey = `tool:${messageId}`;

  const initialState = useMemo(() => {
    const stored = readStoredValue(storageKey);

    return {
      hasStored: stored !== null,
      value: stored ?? defaultValue,
    };
  }, [defaultValue, storageKey]);

  const [value, setValueRaw] = useState(initialState.value);

  const setValue = useCallback(
    (next: boolean) => {
      setValueRaw(next);
      writeStoredValue(storageKey, next);
    },
    [storageKey]
  );

  return [value, setValue, initialState.hasStored] as const;
}
