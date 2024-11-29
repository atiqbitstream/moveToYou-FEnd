import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { ERole } from "../enums/roles.enum";

@Injectable({providedIn:'root'})
export class RoleGuard implements CanActivate
{
    constructor(private authService:AuthService, private router:Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
       
        const requiredRoles = route.data['roles'] as ERole[];

        const currentUserRole = this.authService.getUserRole();

        if(requiredRoles.includes(currentUserRole))
        {
            return true;
        }

        this.router.navigate(['/unauthorized']);
        return false;
    }
}