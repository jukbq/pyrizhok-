import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { ROLE } from './role.constant';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  const router: Router = inject(Router);
  const headerComponent: HeaderComponent = inject(HeaderComponent);
  const login = JSON.parse(localStorage.getItem('currentUser') as string);
  if (login && (login.role === ROLE.ADMIN || login.role === ROLE.USER)) {
    headerComponent.isLogin = true;
    console.log('login', login, login.role);
    return true;
  }
  headerComponent.isLogin = false;
  router.navigate(['']);
  console.log('login, login.role');
  return false;
};
