import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-dashboard">
      <header class="admin-header mb-6">
        <div>
          <h1 class="text-2xl font-bold">{{ t('admin.users') }}</h1>
          <p class="text-muted">{{ t('admin.subtitle') }}</p>
        </div>
        <button class="btn btn-success" (click)="openModal()">
          <i class="fa-solid fa-plus"></i> {{ t('admin.create_user') }}
        </button>
      </header>

      <!-- Stats Grid -->
      <div class="stats-overview mb-8">
        <div class="stat-box card">
          <div class="stat-icon-wrapper users"><i class="fa-solid fa-users"></i></div>
          <div class="stat-content">
            <span class="stat-label">{{ t('admin.stats.users') }}</span>
            <div class="stat-value">{{ stats.total_users }}</div>
          </div>
        </div>
        <div class="stat-box card">
          <div class="stat-icon-wrapper searches"><i class="fa-solid fa-magnifying-glass"></i></div>
          <div class="stat-content">
            <span class="stat-label">{{ t('admin.stats.searches') }}</span>
            <div class="stat-value">{{ stats.total_searches }}</div>
          </div>
        </div>
        <div class="stat-box card">
          <div class="stat-icon-wrapper favorites"><i class="fa-solid fa-heart"></i></div>
          <div class="stat-content">
            <span class="stat-label">{{ t('admin.stats.favorites') }}</span>
            <div class="stat-value">{{ stats.total_favorites }}</div>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="card p-0 overflow-hidden">
        <div class="card-header-actions p-4 flex items-center justify-between border-b">
          <h3 class="m-0 text-lg">{{ t('admin.user_list') }}</h3>
          <div class="search-box">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text" class="search-input" [(ngModel)]="searchTerm" [placeholder]="'Procurar utilizador...'">
          </div>
        </div>
        
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{{ t('admin.name') }}</th>
                <th>{{ t('admin.email') }}</th>
                <th>{{ t('admin.role') }}</th>
                <th class="text-right">{{ t('admin.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of filteredUsers">
                <td class="text-muted">#{{ user.id }}</td>
                <td>
                  <div class="user-info">
                    <div class="avatar">{{ (user.name || '?').charAt(0) }}</div>
                    <span class="font-bold">{{ user.name }}</span>
                  </div>
                </td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="role-badge" [ngClass]="user.role">
                    {{ user.role | uppercase }}
                  </span>
                </td>
                <td class="text-right">
                  <div class="action-buttons">
                    <button class="btn-action edit" (click)="openModal(user)" title="Editar">
                      <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-action delete" *ngIf="user.role !== 'admin'" (click)="deleteUser(user.id)" title="Eliminar">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="filteredUsers.length === 0" class="empty-state p-8 text-center text-muted">
            <i class="fa-solid fa-user-slash text-4xl mb-2"></i>
            <p>Nenhum utilizador encontrado com este critério.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- User Modal -->
    <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
      <div class="card modal-card" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ isEditing ? t('admin.edit_user') : t('admin.create_user') }}</h2>
          <button class="close-btn" (click)="closeModal()">&times;</button>
        </div>
        <form (ngSubmit)="saveUser()" class="modal-body mt-4">
          <div class="form-grid">
            <div class="form-group">
              <label>{{ t('auth.name') }}</label>
              <input type="text" class="input-field" [(ngModel)]="currentUser.name" name="name" required>
            </div>
            <div class="form-group">
              <label>{{ t('auth.email') }}</label>
              <input type="email" class="input-field" [(ngModel)]="currentUser.email" name="email" required>
            </div>
          </div>
          <div class="form-group">
            <label>{{ isEditing ? t('profile.new_password') : t('auth.password') }}</label>
            <input type="password" class="input-field" [(ngModel)]="currentUser.password" name="password" [required]="!isEditing">
          </div>
          <div class="form-group">
            <label>{{ t('admin.role') }}</label>
            <select class="input-field" [(ngModel)]="currentUser.role" name="role">
              <option value="user">USER</option>
              <option value="admin">ADMIN</option>
            </select>
          </div>
          <div class="modal-footer mt-6 flex justify-end gap-3">
            <button type="button" class="btn btn-secondary" (click)="closeModal()">{{ t('admin.cancel') }}</button>
            <button type="submit" class="btn btn-success">{{ t('admin.save') }}</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard { max-width: 1200px; margin: 0 auto; width: 100%; }
    .admin-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--card-border); padding-bottom: 1rem; }
    
    /* Stats Box Layout */
    .stats-overview { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
    .stat-box { display: flex; align-items: center; padding: 1.5rem; gap: 1.25rem; }
    .stat-icon-wrapper { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
    .stat-icon-wrapper.users { background: rgba(217, 119, 6, 0.1); color: #D97706; }
    .stat-icon-wrapper.searches { background: rgba(14, 165, 233, 0.1); color: #0ea5e9; }
    .stat-icon-wrapper.favorites { background: rgba(220, 38, 38, 0.1); color: #dc2626; }
    .stat-label { color: var(--text-muted); font-size: 0.875rem; font-weight: 500; }
    .stat-value { font-size: 1.875rem; font-weight: 700; color: var(--text-color); margin-top: 0.25rem; }

    /* Search Box */
    .search-box { position: relative; width: 300px; }
    .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
    .search-input { width: 100%; padding: 0.5rem 1rem 0.5rem 2.5rem; border: 1px solid var(--card-border); border-radius: 8px; background: var(--bg-color); color: var(--text-color); font-family: inherit; outline: none; transition: border-color 0.2s; }
    .search-input:focus { border-color: var(--primary-color); }

    /* Table Styles */
    .admin-table { width: 100%; border-collapse: collapse; }
    .admin-table th { background: var(--bg-color); padding: 1rem; text-align: left; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--card-border); }
    .admin-table td { padding: 1rem; border-bottom: 1px solid var(--card-border); vertical-align: middle; }
    .user-info { display: flex; align-items: center; gap: 0.75rem; }
    .avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--primary-color); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem; }
    
    .role-badge { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em; }
    .role-badge.admin { background: #fee2e2; color: #991b1b; }
    .role-badge.user { background: #f3f4f6; color: #374151; }

    .action-buttons { display: flex; gap: 0.5rem; justify-content: flex-end; }
    .btn-action { width: 32px; height: 32px; border-radius: 6px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .btn-action.edit { background: rgba(14, 165, 233, 0.1); color: #0ea5e9; }
    .btn-action.edit:hover { background: #0ea5e9; color: white; }
    .btn-action.delete { background: rgba(220, 38, 38, 0.1); color: #dc2626; }
    .btn-action.delete:hover { background: #dc2626; color: white; }

    /* Modal Tweaks */
    .modal-header { display: flex; justify-content: space-between; align-items: center; }
    .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
    
    .p-0 { padding: 0 !important; }
    .border-b { border-bottom: 1px solid var(--card-border); }
    .overflow-hidden { overflow: hidden; }
    .text-2xl { font-size: 1.5rem; }
    .text-4xl { font-size: 2.25rem; }
  `]
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  stats = {
    total_users: 0,
    total_searches: 0,
    total_favorites: 0
  };
  
  showModal = false;
  isEditing = false;
  currentUser: any = {};
  searchTerm = '';

  constructor(
    private userService: UserService,
    private i18n: TranslationService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.userService.getUsers().subscribe(data => this.users = data);
    this.userService.getStats().subscribe(data => this.stats = data);
  }

  get filteredUsers() {
    if (!this.searchTerm) return this.users;
    const term = this.searchTerm.toLowerCase();
    return this.users.filter(u => 
      u.name.toLowerCase().includes(term) || 
      u.email.toLowerCase().includes(term)
    );
  }

  t(key: string): string {
    return this.i18n.translate(key);
  }

  openModal(user?: any) {
    if (user) {
      this.isEditing = true;
      this.currentUser = { ...user, password: '' };
    } else {
      this.isEditing = false;
      this.currentUser = { name: '', email: '', password: '', role: 'user' };
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveUser() {
    const action = this.isEditing 
      ? this.userService.updateUser(this.currentUser)
      : this.userService.createUser(this.currentUser);

    action.subscribe({
      next: () => {
        this.loadData();
        this.closeModal();
      },
      error: (err) => alert(err.error?.message || 'Erro ao salvar utilizador')
    });
  }

  deleteUser(id: number) {
    if(confirm('Tem a certeza que deseja eliminar este utilizador?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => this.loadData(),
        error: (err) => alert('Erro ao eliminar: ' + (err.error?.message || err.message))
      });
    }
  }
}
