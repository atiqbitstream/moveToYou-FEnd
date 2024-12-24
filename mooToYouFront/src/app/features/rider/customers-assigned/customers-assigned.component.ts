import { TokenService } from './../../shared/services/token.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { Customer } from '../../customer/customer-update/customer-update.component';
import { RiderService } from '../services/rider.service';

import { ConfirmationDialogComponent, ConfirmationDialogData } from '../../shared/components/layout/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-customers-assigned',
  standalone:true,
  imports: [RouterLink,CommonModule, ReactiveFormsModule,MatIconModule,MatFormFieldModule,MatOptionModule,MatTableModule,MatChipsModule,MatPaginatorModule,MatSelectModule],
  templateUrl: './customers-assigned.component.html',
  styleUrl: './customers-assigned.component.css'
})
export class CustomersAssignedComponent implements OnInit {

  ngOnInit(): void {
    this.riderId=this.tokenService.getUserId();
    this.onGetAssignedCustomers(this.riderId);
  }

customers:Customer[]=[];

riderId!:number;

constructor(private riderService:RiderService, private tokenService:TokenService, private dialog:MatDialog, private snackBar:MatSnackBar, private router:Router){

  
}


onGetAssignedCustomers(riderId:number)
{
  this.riderService.getAssignedCustomersForRider(riderId).subscribe({
    next:(response)=>{
      this.customers=response;
    }
  })
}


  async openCustomerSelectionDialog(customer: Customer) {

  const rider = this.tokenService.getUser();
  
 const dialogData: ConfirmationDialogData = {
    title: 'Confirm Adding Delivery',
    message: `Are you sure want to add a delivery to ${customer.firstName} ${customer.lastName} today  ${new Date().toLocaleString()} ?`
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
        customerId: customer.id,
      };

      console.log('Sending assignment payload:', payload);

      await firstValueFrom(
         this.riderService.assignDailyDelivery(customer.id)
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
