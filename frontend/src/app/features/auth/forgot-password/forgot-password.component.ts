import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="card auth-card">
        <h2 class="text-center mb-6">{{ t('auth.forgot_title') }}</h2>
        <p class="text-muted text-sm mb-6 text-center">{{ t('auth.forgot_subtitle') }}</p>
        
        <form (ngSubmit)="onSubmit()" *ngIf="!submitted">
          <div class="form-group">
            <label class="font-bold mb-2 block">{{ t('auth.email') }}</label>
            <div class="input-with-icon">
              <i class="fa-solid fa-envelope icon"></i>
              <input type="email" class="input-field pl-10" [(ngModel)]="email" name="email" required placeholder="exemplo@email.com">
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary w-full mt-4" [disabled]="loading">
            <i class="fa-solid fa-paper-plane" *ngIf="!loading"></i>
            <i class="fa-solid fa-circle-notch fa-spin" *ngIf="loading"></i>
            {{ t('auth.send_reset_btn') }}
          </button>
        </form>

        <div *ngIf="submitted" class="text-center">
          <div class="success-icon mb-4"><i class="fa-solid fa-circle-check text-success"></i></div>
          <p class="mb-6">{{ message }}</p>
          <a routerLink="/login" class="btn btn-primary w-full">{{ t('auth.back_to_login') }}</a>
        </div>

        <div class="text-center mt-6" *ngIf="!submitted">
          <a routerLink="/login" class="text-primary text-sm font-bold no-underline"><i class="fa-solid fa-arrow-left"></i> {{ t('auth.back_to_login') }}</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display: flex; align-items: center; justify-content: center; min-height: 80vh; }
    .auth-card { width: 100%; max-width: 400px; padding: 2.5rem; }
    .input-with-icon { position: relative; }
    .icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
    .pl-10 { padding-left: 2.5rem !important; }
    .text-success { color: var(--success-color); font-size: 3rem; }
    .no-underline { text-decoration: none; }
  `]
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  submitted = false;
  message = '';

  constructor(private auth: AuthService, private i18n: TranslationService) {}

  t(key: string): string {
    return this.i18n.translate(key);
  }

  onSubmit() {
    this.loading = true;
    this.auth.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.submitted = true;
        this.message = res.message;
        this.loading = false;
      },
      error: (err) => {
        alert(err.error?.message || 'Erro ao enviar e-mail.');
        this.loading = false;
      }
    });
  }
}
