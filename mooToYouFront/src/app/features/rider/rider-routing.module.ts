
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RiderComponent } from './rider.component';
import { RiderCreateComponent } from './rider-create/rider-create.component';
import { RiderListComponent } from './rider-list/rider-list.component';
import { RiderUpdateComponent } from './rider-update/rider-update.component';
import { CustomersAssignedComponent } from './customers-assigned/customers-assigned.component';
import { DailyDeliveryComponent } from './daily-delivery/daily-delivery.component';

const routes: Routes = [
  {path:'',component:RiderComponent},
  {path:'create',component:RiderCreateComponent},
  {path:'list',component:RiderListComponent},
  {path:'update/:id',component:RiderUpdateComponent},
  {path:'assignedCustomers',component:CustomersAssignedComponent},
  {path:'dailyDeliveries',component:DailyDeliveryComponent}
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiderRoutingModule { }
