import { response } from 'express';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-customer-create',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
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
