import { useEffect, useState } from 'react';

type Listener = (path: string) => void;

let currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
const listeners = new Set<Listener>();

export function getPath(): string {
  return currentPath;
}

export function navigate(path: string) {
  
  if (typeof window === 'undefined' || path === currentPath) return;
  window.history.pushState({}, '', path);
  currentPath = path;
  window.scrollTo(0, 0);
  listeners.forEach(l => l(path));
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    currentPath = window.location.pathname;
    listeners.forEach(l => l(currentPath));
  });
}

export function usePath(): string {
  const [path, setPath] = useState(currentPath);
  useEffect(() => subscribe(setPath), []);
  return path;
}