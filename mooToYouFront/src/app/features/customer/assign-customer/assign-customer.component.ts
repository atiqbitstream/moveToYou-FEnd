import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Rider } from '../../rider/interfaces/rider.interface';
import { RiderService } from '../../rider/services/rider.service';
import { TokenService } from '../../shared/services/token.service';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../customer-update/customer-update.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../../shared/components/layout/confirmation-dialog/confirmation-dialog.component';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-assign-customer',
  standalone:true,
  imports: [RouterLink,CommonModule, ReactiveFormsModule,MatIconModule,MatFormFieldModule,MatOptionModule,MatTableModule,MatChipsModule,MatPaginatorModule,MatSelectModule],
  templateUrl: './assign-customer.component.html',
  styleUrl: './assign-customer.component.css'
})
export class AssignCustomerComponent implements OnInit {

  selectedCustomer!:Customer;

  ngOnInit(): void {
    this.route.params.subscribe(params=>{
      const customerId = params['customerId'];
      console.log(" i am customer id in ngoninit : ",customerId)
      if(customerId)
      {
        this.customerService.fetchCustomer(customerId).subscribe(
          customer=>{
            this.selectedCustomer=customer;
            console.log("i am selected customer and i am here : ",this.selectedCustomer)
          }
        )
      }
    })
  }

  organizationId= new FormControl('');

  riders:Rider[]=[];
 


  constructor(private riderService:RiderService,private customerService:CustomerService, private tokenService:TokenService, private route:ActivatedRoute, private dialog:MatDialog, private snackBar:MatSnackBar, private router:Router){
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

 async assignCustomerToRider(rider: Rider) {
  console.log('Assigning Customer to Rider:', { rider, customer: this.selectedCustomer });
  
  if (!rider?.id || !this.selectedCustomer?.id) {
    this.showErrorMessage('Missing rider or customer information');
    return;
  }

  const dialogData: ConfirmationDialogData = {
    title: 'Confirm Assignment',
    message: `Are you sure you want to assign ${this.selectedCustomer.firstName} ${this.selectedCustomer.lastName} to ${rider.firstName} ${rider.lastName}?`
  };

  try {
    const confirmed = await firstValueFrom(
      this.dialog.open(ConfirmationDialogComponent, {
        data: dialogData,
        width: '400px'
      }).afterClosed()
    );

    if (confirmed) {
      const payload = {
        riderId: rider.id,
        customerId: this.selectedCustomer.id
      };

      console.log('Sending assignment payload:', payload);

      await firstValueFrom(
        this.customerService.assignCustomerToRider(payload)
      );

      this.showSuccessMessage('Customer assigned successfully');
      this.router.navigate(['/customers']);
    }
  } catch (error) {
    console.error('Error in assignment process:', error);
    this.showErrorMessage('Failed to assign customer');
  }
}

private showSuccessMessage(message: string): void {
  this.snackBar.open(message, 'Close', {
    duration: 3000,
    panelClass: ['success-snackbar']
  });
}

private showErrorMessage(message: string): void {
  this.snackBar.open(message, 'Close', {
    duration: 3000,
    panelClass: ['error-snackbar']
  });
}
}


