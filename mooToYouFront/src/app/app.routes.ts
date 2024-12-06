import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { UnauthorizedComponent } from './features/shared/components/unauthorized/unauthorized.component';
import { RoleGuard } from './features/shared/guards/role.guard';
import { ERole } from './features/shared/enums/roles.enum';

export const routes: Routes = [
    {path:'',component:LoginComponent},
    {path:'home',component:HomeComponent},
    {path:'unauthorized',component:UnauthorizedComponent},
    {
        path:'riders',
        loadChildren:()=>import('./features/rider/rider.module').then(m=>m.RiderModule),
        canActivate:[RoleGuard],
        data:{roles:[ERole.RIDER]}
    },
    {
        path:'customers',
        loadChildren : ()=>import('./features/customer/customer.module').then(m=>m.CustomerModule),
        canActivate:[RoleGuard],
        data:{roles:[ERole.ADMIN]}
    }
];
