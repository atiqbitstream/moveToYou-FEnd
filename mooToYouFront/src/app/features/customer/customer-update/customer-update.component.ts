import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonEngine } from '@angular/ssr';
import { response } from 'express';
import { CustomerService } from '../services/customer.service';
import { error } from 'console';

@Component({
  selector: 'app-customer-update',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './customer-update.component.html',
  styleUrl: './customer-update.component.css',
})
export class CustomerUpdateComponent implements OnInit {
  customerUpdateForm!: FormGroup;
  customerId!: number;
  organizationId!: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.customerUpdateForm = new FormGroup({
      firstName: new FormControl([
        '',
        Validators.required,
        Validators.minLength(5),
      ]),

      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),

      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(11),
        Validators.pattern(/[0-9]/),
      ]),
      address: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      sector: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
      ]),
      street: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      googlePin: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      homePicture: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),

      status: new FormControl('', [Validators.required]),
      organization: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),

      organizationId: new FormControl(''),

      contract: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
    });

    this.customerUpdateForm
      .get('organization')
      ?.valueChanges.subscribe((org) => {
        this.setOrganizationId(org);
      });

    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      const orgIdParam = params.get('orgId');
      if (idParam && orgIdParam) {
        this.customerId = +idParam;
        this.organizationId = +orgIdParam;
      }
    });
  }

  setOrganizationId(organization: string) {
    switch (organization) {
      case 'emaanDairy':
        this.customerUpdateForm.get('organizationId')?.setValue(1);
        break;
      case 'newDairy':
        this.customerUpdateForm.get('organizationId')?.setValue(2);
        break;
      default:
        this.customerUpdateForm.get('organizationId')?.setValue(null);
        break;
    }
  }

  fetchCustomerDetails() {
    this.customerService
      .fetchCustomerByIdnOrg(this.customerId, this.organizationId)
      .subscribe({
        next: (customer) => {
          console.log("here are the fetched customer detials : ",customer)
          const orgId =
            customer.organization === 'Emaan Dairy'
              ? 1
              : customer.organization === 'New Dairy'
              ? 2
              : null;

          this.customerUpdateForm.patchValue({
            ...customer,
            organizationId: orgId,
            organization:
              orgId == 1 ? 'emaanDairy' : orgId == 2 ? 'newDairy' : '',
          });
          console.log("customer update form ",this.customerUpdateForm)
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  onCustomerUpdate() {
    if (this.customerUpdateForm.valid) {
      const customerData = {
        ...this.customerUpdateForm.value,
        id: this.customerId,
        orgId: this.organizationId,
      };

      if (!customerData.organizationId) {
        console.log('update customer data deos not have organization Id');
        return;
      }

      this.customerService
        .updateCustomer(this.customerId, customerData)
        .subscribe({
          next: (response) => {
            console.log('Customer updated sucessfully', response);
            this.router.navigate(['/customers']);
          },
          error: (error) => {
            console.error(error);
          },
        });
    }
  }
}
