import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../userauth/userauth.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const isAdmin = this.authService.getIsAdmin();
    if (!isAdmin) {
      this.router.navigate(['/login']);
    }
    return isAdmin;
  }
}
