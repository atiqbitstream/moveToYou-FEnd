import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { error } from 'console';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatOptionModule, NativeDateModule} from '@angular/material/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatChip, MatChipsModule} from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { ICustomer } from '../interfaces/customerCreate.interface';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../shared/services/token.service';
import { Customer } from '../customer-update/customer-update.component';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [RouterLink,CommonModule, ReactiveFormsModule,MatIconModule,MatFormFieldModule,MatOptionModule,MatTableModule,MatChipsModule,MatPaginatorModule,MatSelectModule],
  
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent {
organizationId= new FormControl('');

customers:Customer[]=[];

displayedColumns: string[] = [
  'firstName', 
  'lastName', 
  'phoneNumber', 
  'address', 
  'sector', 
  'street', 
  'googlePin', 
  'organization', 
  'status', 
  'contract', 
  'actions'
];



constructor(private customerService:CustomerService, private tokenService:TokenService){
  this.onSendOrganizationId();
}

onSendOrganizationId() {
  const orgId = this.tokenService.getStoredOrgId();
  if (orgId !== null) {
    this.customerService.fetchCustomersByOrganization(+orgId).subscribe({
      next: (response) => {
        console.log('API Response:', response); // Debug: Log the response
        this.customers = [...response]; // Assign response to customers
        console.log('Customers Array:', this.customers); // Debug: Log the updated array
      },
      error: (error) => {
        console.error('Error fetching customers:', error);
      }
    });
  }
}


  onDeleteCustomer(customerId:number)
  {
    this.customerService.softDeleteCustomer(customerId).subscribe({
      next:()=>{
        this.customers.filter(customer=>customer.id)
        console.log("customer deleted succesfully!")
      },
      error:(error)=>{
        console.error('Error deleting customer : ',error);
      }
    })
  }



}
