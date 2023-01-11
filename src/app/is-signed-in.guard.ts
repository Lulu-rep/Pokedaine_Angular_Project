import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { lastValueFrom, Observable } from 'rxjs';
import { UserService } from './service/user.service';

@Injectable({
  providedIn: 'root'
})
export class IsSignedInGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree>  {
      try {
        await lastValueFrom(this.userService.isConnected());
        return true;
        } catch (err) {
        return this.router.createUrlTree(['']);
        }

        
/*
    return this.userService.isConnected().pipe(map(() => {
      return true;
    }),
    catchError(() => {
        return of(this.router.createUrlTree(['']));
      })
    );*/
  
  
  }
  
}
