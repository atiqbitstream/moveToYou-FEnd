import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { RiderService } from '../services/rider.service';
import { response } from 'express';
import { error } from 'console';
import { Rider } from '../interfaces/rider.interface';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TokenService } from '../../shared/services/token.service';

@Component({
  selector: 'app-rider-list',
  standalone: true,
  imports: [RouterLink,CommonModule, ReactiveFormsModule,MatIconModule,MatFormFieldModule,MatOptionModule,MatTableModule,MatChipsModule,MatPaginatorModule,MatSelectModule],
  templateUrl: './rider-list.component.html',
  styleUrl: './rider-list.component.css'
})
export class RiderListComponent implements OnInit {

  ngOnInit(): void {
    
  }

  organizationId= new FormControl('');

  riders:Rider[]=[];
 


  constructor(private riderService:RiderService, private tokenService:TokenService){
    this.onSendOrganizationId();
  }

  onSendOrganizationId()
  {

   const orgId= this.tokenService.getStoredOrgId() ;
   if(orgId!==null){
     this.riderService.getAllRiders(+orgId).subscribe({
       next:(response)=>{
         this.riders=response
       }
     })
  }
 }


 onDeleteRider(riderId:number)
 {
   this.riderService.softDeleteRider(riderId).subscribe({
    next:()=>{
      this.riders.filter(rider=>rider.id)
      console.log("Rider deleted successfully!")
    },
    error:(error)=>{
      console.error('error deleting Rider : ',error)
    }
   })
 }
  
 assignCustomerToRider(riderId:number)
 {
  console.log(riderId);
 }

  // getCurrentRider()
  // {
  //   this.riderService.getRider().subscribe({
  //     next:(response)=>{
  //       console.log("The current rider is : ",response)
  //       this.currentRider=response;
  //     },
  //     error:(err)=>{
  //       console.log("Error from getting current rider is : ",err)
  //     }
  //   })
  // }


}
