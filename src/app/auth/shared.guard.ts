import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Role } from '../shared/models/user.model';

@Injectable()
export class SharedGuard implements CanActivate {
  constructor(private router: Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if(localStorage.getItem('userRole') == Role.USER || 
         localStorage.getItem('userRole') == Role.ADMIN){
        return true;
      }
      this.router.navigate(['signin']);
      return false;
  }
}
