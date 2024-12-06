
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RiderComponent } from './rider.component';
import { RiderCreateComponent } from './rider-create/rider-create.component';
import { RiderListComponent } from './rider-list/rider-list.component';
import { RoleGuard } from '../shared/guards/role.guard';
import { ERole } from '../shared/enums/roles.enum';

const routes: Routes = [
  {path:'',component:RiderComponent},
  {path:'create',component:RiderCreateComponent},
  {path:'list',component:RiderListComponent},
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiderRoutingModule { }
