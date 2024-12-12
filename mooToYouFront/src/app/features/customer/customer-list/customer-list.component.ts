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

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [RouterLink,CommonModule, ReactiveFormsModule,MatIconModule,MatFormFieldModule,MatOptionModule,MatTableModule,MatChipsModule,MatPaginatorModule,MatSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent {
organizationId= new FormControl('');

customers:any[]=[];

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

@ViewChild(MatPaginator) paginator!: MatPaginator;
dataSource!: MatTableDataSource<ICustomer>;

constructor(private customerService:CustomerService, private dialog:MatDialog){}

   onSendOrganizationId()
   {

    const orgId= this.organizationId.value ;
    if(orgId!==null && orgId!==''){
      this.customerService.fetchCustomersByOrganization(+orgId).subscribe({
        next:(response)=>{
          this.customers=response
        }
      })
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
