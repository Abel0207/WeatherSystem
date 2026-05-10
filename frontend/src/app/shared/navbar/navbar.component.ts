import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <h2><i class="fa-solid fa-cloud-sun text-primary"></i> WeatherSystem</h2>
      </div>
      <div class="nav-links">
        <a *ngIf="isLoggedIn" routerLink="/dashboard" class="nav-item"><i class="fa-solid fa-chart-line"></i> {{ t('nav.dashboard') }}</a>
        <a *ngIf="isAdmin" routerLink="/admin" class="nav-item"><i class="fa-solid fa-shield-halved"></i> {{ t('nav.admin') }}</a>
      </div>
      <div class="nav-actions">
        <button class="btn-icon" (click)="toggleTheme()" title="Mudar Tema"><i class="fa-solid fa-circle-half-stroke"></i></button>
        <button class="btn-icon lang-btn" (click)="toggleLanguage()">{{ currentLang | uppercase }}</button>
        <div *ngIf="isLoggedIn" class="user-menu">
          <a routerLink="/profile" class="nav-item profile-link"><i class="fa-solid fa-user"></i> Perfil</a>
          <button class="btn btn-danger btn-small" (click)="logout()"><i class="fa-solid fa-right-from-bracket"></i> {{ t('nav.logout') }}</button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: var(--card-bg);
      border-bottom: 1px solid var(--card-border);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
    .text-primary { color: var(--primary-color); }
    .nav-brand h2 { margin: 0; color: var(--text-color); font-weight: 700; letter-spacing: -0.5px; }
    .nav-links { display: flex; gap: 2rem; }
    .nav-item { color: var(--text-muted); text-decoration: none; font-weight: 500; font-size: 0.95rem; transition: color 0.2s; display: flex; align-items: center; gap: 0.5rem; }
    .nav-item:hover { color: var(--primary-color); }
    .nav-actions { display: flex; gap: 1rem; align-items: center; }
    .user-menu { display: flex; gap: 1rem; align-items: center; border-left: 1px solid var(--card-border); padding-left: 1rem; margin-left: 0.5rem; }
    .btn-icon { background: none; border: none; font-size: 1.1rem; cursor: pointer; color: var(--text-muted); transition: color 0.2s; }
    .btn-icon:hover { color: var(--primary-color); }
    .lang-btn { font-size: 0.875rem; font-weight: 600; padding: 0.25rem 0.5rem; border: 1px solid var(--card-border); border-radius: 4px; }
    .btn-small { padding: 0.4rem 0.8rem; font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; }
    .profile-link { font-weight: 600; }
  `]
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  currentLang = 'pt';

  constructor(
    private auth: AuthService,
    private themeService: ThemeService,
    private i18n: TranslationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === 'admin';
    });
    this.i18n.lang$.subscribe(l => this.currentLang = l);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleLanguage() {
    const newLang = this.currentLang === 'pt' ? 'en' : 'pt';
    this.i18n.setLanguage(newLang);
  }

  t(key: string): string {
    return this.i18n.translate(key);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
