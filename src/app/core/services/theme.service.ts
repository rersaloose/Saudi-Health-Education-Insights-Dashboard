import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'ksauhs-theme';

  readonly theme = signal<Theme>(this.readInitial());

  constructor() {
    effect(() => {
      const t = this.theme();
      document.documentElement.setAttribute('data-theme', t);
      try {
        localStorage.setItem(this.storageKey, t);
      } catch {}
    });
  }

  toggle(): void {
    this.theme.update((t) => (t === 'light' ? 'dark' : 'light'));
  }

  setTheme(t: Theme): void {
    this.theme.set(t);
  }

  private readInitial(): Theme {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {}
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
}
