import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RiderRoutingModule } from './rider-routing.module';
import { RiderComponent } from './rider.component';
import { RiderCreateComponent } from './rider-create/rider-create.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RiderRoutingModule,
  ]
})
export class RiderModule { }
