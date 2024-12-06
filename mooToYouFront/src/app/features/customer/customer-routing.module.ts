import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerCreateComponent } from './customer-create/customer-create.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerComponent } from './customer.component';
import { RoleGuard } from '../shared/guards/role.guard';
import { ERole } from '../shared/enums/roles.enum';

const routes: Routes = [
  {path:'',component:CustomerComponent},
  {path : 'create', component:CustomerCreateComponent},
  {path:'list', component:CustomerListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
