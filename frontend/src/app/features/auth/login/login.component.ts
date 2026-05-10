import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="card auth-card">
        <h2 class="text-center"><i class="fa-solid fa-right-to-bracket text-primary"></i> {{ t('auth.login_title') }}</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <input type="email" class="input-field" [(ngModel)]="email" name="email" [placeholder]="t('auth.email')" required>
          </div>
          <div class="form-group">
            <input type="password" class="input-field" [(ngModel)]="password" name="password" [placeholder]="t('auth.password')" required>
          </div>
          <p class="error-msg" *ngIf="error">{{ error }}</p>
          <div class="mt-4">
            <button type="submit" class="btn btn-primary w-full" [disabled]="loading">
              <i class="fa-solid fa-right-to-bracket" *ngIf="!loading"></i>
              <i class="fa-solid fa-circle-notch fa-spin" *ngIf="loading"></i>
              {{ t('auth.login_btn') }}
            </button>
          </div>

          <div class="text-right mt-2">
            <a routerLink="/forgot-password" class="text-primary text-sm no-underline">{{ t('auth.forgot_link') }}</a>
          </div>
        </form>
        <div class="text-center mt-4">
          <a routerLink="/register">{{ t('auth.no_account') }}</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display: flex; justify-content: center; align-items: center; min-height: 70vh; }
    .auth-card { width: 100%; max-width: 400px; }
    .w-100 { width: 100%; }
    .error-msg { color: var(--danger-color); text-align: center; }
    a { color: var(--primary-color); text-decoration: none; }
    a:hover { text-decoration: underline; }
    .no-underline { text-decoration: none; }
    .text-right { text-align: right; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private i18n: TranslationService
  ) {}

  t(key: string): string {
    return this.i18n.translate(key);
  }

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Login falhou';
      }
    });
  }
}
