import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkTheme = new BehaviorSubject<boolean>(this.getInitialTheme());
  isDarkTheme = this.darkTheme.asObservable();

  private getInitialTheme(): boolean {
    if (localStorage.getItem('theme')) {
      return localStorage.getItem('theme') === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  constructor() {
    this.applyTheme(this.darkTheme.value);
  }

  toggleTheme() {
    const isDark = !this.darkTheme.value;
    this.darkTheme.next(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    this.applyTheme(isDark);
  }

  private applyTheme(isDark: boolean) {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
  }
}
