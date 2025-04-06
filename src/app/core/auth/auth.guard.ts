import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthFacade } from './auth.facade';

export const authGuard: CanActivateFn = () => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);

  return authFacade.isAuthenticated$.pipe(
    map(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/login']);
        return false;
      }

      return true;
    })
  );
};
