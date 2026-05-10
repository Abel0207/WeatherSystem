import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="card auth-card">
        <h2 class="text-center mb-6">{{ t('auth.reset_title') }}</h2>
        
        <form (ngSubmit)="onSubmit()" *ngIf="!submitted">
          <div class="form-group">
            <label class="font-bold mb-2 block">{{ t('auth.new_password') }}</label>
            <div class="input-with-icon">
              <i class="fa-solid fa-lock icon"></i>
              <input type="password" class="input-field pl-10" [(ngModel)]="password" name="password" required placeholder="••••••••">
            </div>
          </div>

          <div class="form-group">
            <label class="font-bold mb-2 block">{{ t('auth.confirm_password') }}</label>
            <div class="input-with-icon">
              <i class="fa-solid fa-lock icon"></i>
              <input type="password" class="input-field pl-10" [(ngModel)]="confirmPassword" name="confirmPassword" required placeholder="••••••••">
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary w-full mt-4" [disabled]="loading">
            <i class="fa-solid fa-save" *ngIf="!loading"></i>
            <i class="fa-solid fa-circle-notch fa-spin" *ngIf="loading"></i>
            {{ t('auth.reset_btn') }}
          </button>
        </form>

        <div *ngIf="submitted" class="text-center">
          <div class="success-icon mb-4"><i class="fa-solid fa-circle-check text-success"></i></div>
          <p class="mb-6">{{ t('auth.reset_success') }}</p>
          <a routerLink="/login" class="btn btn-primary w-full">{{ t('auth.back_to_login') }}</a>
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
  `]
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  password = '';
  confirmPassword = '';
  loading = false;
  submitted = false;

  constructor(
    private auth: AuthService, 
    private i18n: TranslationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'] || '';
    if (!this.token) {
      alert('Token de recuperação não encontrado.');
      this.router.navigate(['/login']);
    }
  }

  t(key: string): string {
    return this.i18n.translate(key);
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    this.loading = true;
    this.auth.resetPassword(this.token, this.password).subscribe({
      next: () => {
        this.submitted = true;
        this.loading = false;
      },
      error: (err) => {
        alert(err.error?.message || 'Erro ao redefinir senha.');
        this.loading = false;
      }
    });
  }
}
