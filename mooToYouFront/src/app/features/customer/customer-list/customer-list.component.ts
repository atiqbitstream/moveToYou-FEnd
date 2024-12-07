import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { error } from 'console';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent {
organizationId= new FormControl('');

customers:any[]=[];

constructor(private customerService:CustomerService){}

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
