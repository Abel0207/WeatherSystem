import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AdminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUserValue;
  if (user && user.token && user.role === 'admin') {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
