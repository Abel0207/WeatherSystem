import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="card profile-card mx-auto" style="max-width: 500px;">
        <div class="card-header text-center mb-4">
          <h2><i class="fa-solid fa-user-gear text-primary"></i> {{ t('profile.title') }}</h2>
          <p class="text-muted">{{ t('profile.subtitle') }}</p>
        </div>

        <form (ngSubmit)="updateProfile()">
          <div class="form-group">
            <label class="font-bold mb-2 block">{{ t('auth.name') }}</label>
            <input type="text" class="input-field" [(ngModel)]="profileData.name" name="name" required>
          </div>

          <div class="form-group">
            <label class="font-bold mb-2 block">{{ t('auth.email') }}</label>
            <input type="email" class="input-field" [(ngModel)]="profileData.email" name="email" required>
          </div>

          <div class="form-group">
            <label class="font-bold mb-2 block">{{ t('profile.new_password') }}</label>
            <input type="password" class="input-field" [(ngModel)]="profileData.password" name="password" [placeholder]="t('profile.password_placeholder')">
          </div>

          <div class="mt-6">
            <button type="submit" class="btn w-full">
              <i class="fa-solid fa-save"></i> {{ t('profile.save_btn') }}
            </button>
          </div>
        </form>

        <div *ngIf="message" [class]="'mt-4 text-center ' + (isError ? 'text-danger' : 'text-success')">
          <i [class]="isError ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-check'"></i> {{ message }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-card { padding: 2rem; }
    .block { display: block; }
    .text-success { color: var(--success-color); }
  `]
})
export class ProfileComponent implements OnInit {
  profileData = {
    name: '',
    email: '',
    password: ''
  };
  message = '';
  isError = false;

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private i18n: TranslationService
  ) {}

  ngOnInit() {
    this.auth.currentUser.subscribe(user => {
      if (user) {
        this.profileData.name = user.name;
        this.profileData.email = user.email;
      }
    });
  }

  updateProfile() {
    this.userService.updateProfile(this.profileData).subscribe({
      next: (res) => {
        this.message = res.message;
        this.isError = false;
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        currentUser.name = this.profileData.name;
        currentUser.email = this.profileData.email;
        this.auth.updateCurrentUser(currentUser);
      },
      error: (err) => {
        this.message = err.error?.message || 'Erro ao atualizar perfil';
        this.isError = true;
      }
    });
  }

  t(key: string): string {
    return this.i18n.translate(key);
  }
}
