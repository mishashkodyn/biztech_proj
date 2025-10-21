import { CanActivateFn } from '@angular/router';
import { AuthService } from '../api/services/auth.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  if(inject(AuthService).isLoggedIn()) {
    return false;
  }
  return true;
};
