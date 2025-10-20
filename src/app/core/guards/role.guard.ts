import { Injectable } from '@angular/core';
import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const expectedRoles = route.data['roles'] as string[];
        const userRole = this.authService.getUserRole();
        console.log(localStorage.getItem('token'));
        
        if (userRole && expectedRoles.includes(userRole)) {
            return true;
        } else {
            this.router.navigate(['/forbidden']);
            return false;
        }
    }
}
