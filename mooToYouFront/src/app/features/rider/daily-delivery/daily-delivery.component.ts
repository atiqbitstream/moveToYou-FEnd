import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatListModule} from '@angular/material/list';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { RiderService } from '../services/rider.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Customer } from '../../customer/customer-update/customer-update.component';
import { TokenService } from '../../shared/services/token.service';

export interface DailyDeliveryWithCustomer {
  id: number;
  date: Date;
  customer: {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    sector: string;
    street: string;
    organization:string;
    status:boolean;
    googlePin:string;
  };
  
}


@Component({
  selector: 'app-daily-delivery',
  standalone:true,
  imports: [RouterLink,CommonModule, ReactiveFormsModule,MatIconModule,MatFormFieldModule,MatOptionModule,MatTableModule,MatChipsModule,MatPaginatorModule,MatSelectModule],
  providers:[provideNativeDateAdapter()],
  templateUrl: './daily-delivery.component.html',
  styleUrl: './daily-delivery.component.css'
})
export class DailyDeliveryComponent implements OnInit{

 



  dailyDelveries:DailyDeliveryWithCustomer[]=[];

  ngOnInit(): void {
   

   

    this.onGetAssignedDailyDelveries();
  }

  constructor(private riderService:RiderService, private tokenService:TokenService){}

 

  onGetAssignedDailyDelveries()
  {
    this.riderService.getDailyDelveries().subscribe(
      {
        next:(response:DailyDeliveryWithCustomer[])=>{
          this.dailyDelveries=response;
        }
      }
    )
  }

 
}









