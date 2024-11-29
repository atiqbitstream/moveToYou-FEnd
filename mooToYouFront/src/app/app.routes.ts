import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
    {path:'',component:LoginComponent},
    {
        path:'riders',
        loadChildren:()=>import('./features/rider/rider.module').then(m=>m.RiderModule),
    },
    {
        path:'customers',
        loadChildren : ()=>import('./features/customer/customer.module').then(m=>m.CustomerModule)
    }
];
