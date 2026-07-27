import { useCallback, useEffect, useState } from 'react';

// ─── REDUCED MOTION ─────────────────────────────────────────────────────────
// Two sources feed the final value:
//  1. The OS-level `prefers-reduced-motion` setting — respected automatically,
//     no opt-in required.
//  2. A manual toggle in the UI, for people who want less motion without
//     having that system setting on. Once someone touches the toggle, their
//     explicit choice persists (localStorage) and stops tracking the system
//     setting — an explicit choice should never be silently overridden.

const STORAGE_KEY = 'pf-reduced-motion';

function systemPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function readStoredPreference(): boolean | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === 'true')  return true;
    if (v === 'false') return false;
    return null;
  } catch {
    return null;
  }
}

function writeStoredPreference(value: boolean) {
  try { window.localStorage.setItem(STORAGE_KEY, String(value)); } catch { /* ignore */ }
}

export function useReducedMotion(): [boolean, (value: boolean) => void] {
  const [value, setValue] = useState<boolean>(() => {
    const stored = readStoredPreference();
    return stored !== null ? stored : systemPrefersReducedMotion();
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => {
      
      if (readStoredPreference() === null) setValue(mq.matches);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const update = useCallback((next: boolean) => {
    writeStoredPreference(next);
    setValue(next);
  }, []);

  return [value, update];
}