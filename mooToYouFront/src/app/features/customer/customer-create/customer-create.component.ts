import { response } from 'express';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-create',
  standalone: true,
  imports: [RouterLink,CommonModule, ReactiveFormsModule,MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './customer-create.component.html',
  styleUrl: './customer-create.component.css'
})
export class CustomerCreateComponent implements OnInit {

  customerCreationForm!:FormGroup;

  constructor(private customerService:CustomerService){}

  ngOnInit(): void {
    this.customerCreationForm= new FormGroup({
      firstName: new FormControl('',[
        Validators.required,
        Validators.minLength(5),
      ]),

      lastName: new FormControl('',[
        Validators.required,
        Validators.minLength(5),
      ]),
      
      phoneNumber : new FormControl('',[
        Validators.required,
        Validators.minLength(11),
        Validators.pattern(/[0-9]/)
      ]),
      address: new FormControl('',[
        Validators.required,
        Validators.minLength(50),
      ]),
      sector : new FormControl('',[
        Validators.required,
        Validators.maxLength(10)
      ]),
      street: new FormControl('',[
        Validators.required,
        Validators.minLength(8),
      ]),
      googlePin:new FormControl('',[
        Validators.required,
        Validators.minLength(10)
      ]),
      homePicture : new FormControl('',[
        Validators.required,
        Validators.minLength(10)
      ]),

      status:new FormControl('',[
       Validators.required
      ]),
      organization: new FormControl('',[
        Validators.required,
        Validators.minLength(10)
      ]),

      organizationId: new FormControl(''),

      contract:new FormControl('',[
        Validators.required,
        Validators.minLength(10),
      ])

    
      
    })

    this.customerCreationForm.get('organization')?.valueChanges.subscribe(org=>{
      this.setOrganizationId(org);
    })
  }
  get firstName() {
    return this.customerCreationForm.get('firstName');
  }
  
  get lastName() {
    return this.customerCreationForm.get('lastName');
  }
  
  get phoneNumber() {
    return this.customerCreationForm.get('phoneNumber');
  }
  
  get address() {
    return this.customerCreationForm.get('address');
  }
  
  get sector() {
    return this.customerCreationForm.get('sector');
  }
  
  get street() {
    return this.customerCreationForm.get('street');
  }
  
  get googlePin() {
    return this.customerCreationForm.get('googlePin');
  }
  
  get homePicture() {
    return this.customerCreationForm.get('homePicture');
  }
  
  get status() {
    return this.customerCreationForm.get('status');
  }
  
  get organization() {
    return this.customerCreationForm.get('organization');
  }
  
  get organizationId() {
    return this.customerCreationForm.get('organizationId');
  }
  
  get contract() {
    return this.customerCreationForm.get('contract');
  }
  

  setOrganizationId(organization:string)
  {
    switch(organization)
    {
      case 'emaanDairy':
        this.customerCreationForm.get('organizationId')?.setValue(1);
        break;

      case 'newDairy':
        this.customerCreationForm.get('organizationId')?.setValue(2);
        break;
        default:
          this.customerCreationForm.get('organizationId')?.setValue(null);
          break;
    }
  }

  onCustomerCreate()
  {
    const customerData = this.customerCreationForm.value;

    this.customerService.customerCreate(customerData).subscribe({
      next:(response)=>{
        console.log('Customer Created SuccessFully  : ',response)
      }
    })
  }





}
