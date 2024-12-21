import { CustomerComponent } from './../customer.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { response } from 'express';
import { CustomerService } from '../services/customer.service';
import { error } from 'console';
import { switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export interface Customer
{

  id:number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  sector: string;
  street: string;
  googlePin: string;
  homePicture: string;
  organization: string;
  organizationId:number
  status: boolean;
  contract: string;

}

@Component({
  selector: 'app-customer-update',
  standalone: true,
  imports: [CommonModule,
      ReactiveFormsModule,
      MatButtonModule,
      MatIconModule,
      MatProgressSpinnerModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatSnackBarModule],
  templateUrl: './customer-update.component.html',
  styleUrl: './customer-update.component.css',
})
export class CustomerUpdateComponent implements OnInit {
  customerUpdateForm!: FormGroup;
  customerId!: number;
  isLoading = false;
 

  constructor(
    private router: Router,
    private fb:FormBuilder,
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
   this.route.params.pipe(
    switchMap(params=>{
      this.customerId =+params['id'];
      return this.customerService.fetchCustomer(this.customerId);
    })
   ).subscribe((customer:Customer | null)=>{
    if(customer)
    {
      this.populateForm(customer)
    }
   })
  }

  private createForm()
  {
    this.customerUpdateForm=this.fb.group({
      firstName : ['',[Validators.required, Validators.minLength(5)]],
      lastName : ['',[Validators.required, Validators.minLength(5)]],
      phoneNumber:['',[Validators.required,Validators.pattern('^[0-9]{11}$')]],
      address: ['', [Validators.maxLength(50)]],
      sector: ['', [Validators.maxLength(10)]],
      street: [''],
      googlePin : ['', [Validators.required, Validators.minLength(10)]],
      homePicture:['',[Validators.required, Validators.minLength(10)]],
      status: ['',[Validators.required,]],
      organization: ['', Validators.required],
      organizationId: [''],
      contract:['',[Validators.required,Validators.minLength(10)]]
    })
  }

  private populateForm(customer:Customer)
  {
    this.customerUpdateForm.patchValue({
      firtName:customer.firstName,
      lastName:customer.lastName,
      phoneNumber:customer.phoneNumber,
      address: customer.address,
      sector:customer.sector,
      street:customer.street,
      googlepin:customer.googlePin,
      homePicture:customer.homePicture,
      status:customer.status,
      organization:customer.organization,
      organizationId:customer.organizationId,
      contract:customer.contract
    })
  }

  // Getter methods for form controls
get firstName() {
  return this.customerUpdateForm.get('firstName');
}
get lastName() {
  return this.customerUpdateForm.get('lastName');
}
get phoneNumber() {
  return this.customerUpdateForm.get('phoneNumber');
}
get address() {
  return this.customerUpdateForm.get('address');
}
get sector() {
  return this.customerUpdateForm.get('sector');
}
get street() {
  return this.customerUpdateForm.get('street');
}
get googlePin() {
  return this.customerUpdateForm.get('googlePin');
}
get homePicture() {
  return this.customerUpdateForm.get('homePicture');
}
get status() {
  return this.customerUpdateForm.get('status');
}
get organization() {
  return this.customerUpdateForm.get('organization');
}
get organizationId() {
  return this.customerUpdateForm.get('organizationId');
}
get contract() {
  return this.customerUpdateForm.get('contract');
}


onCustomerUpdate()
{
  const updateCustomer = this.customerUpdateForm.value;

  this.customerService.updateCustomer(this.customerId,updateCustomer).subscribe(
    response=>{
      if(response)
      {
        console.log("Customers updated successfully");
        this.router.navigate(['/customers'])
      }
    }
  )
}

 
  
}
