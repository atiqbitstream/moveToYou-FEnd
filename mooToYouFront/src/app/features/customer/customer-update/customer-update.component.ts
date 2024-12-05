import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-customer-update',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './customer-update.component.html',
  styleUrl: './customer-update.component.css'
})
export class CustomerUpdateComponent {

  customerUpdateForm!: FormGroup;
  customerId!: number;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCustomerData();
    this.setupOrganizationListener();
  }

  private initForm(): void {
    this.customerUpdateForm = new FormGroup({
      id: new FormControl(''),
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(5)
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(5)
      ]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(11),
        Validators.pattern(/^[0-9]+$/)
      ]),
      address: new FormControl('', [
        Validators.required,
        Validators.minLength(50)
      ]),
      sector: new FormControl('', [
        Validators.required,
        Validators.maxLength(10)
      ]),
      street: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      googlePin: new FormControl('', [
        Validators.required,
        Validators.minLength(10)
      ]),
      homePicture: new FormControl('', [
        Validators.required,
        Validators.minLength(10)
      ]),
      status: new FormControl('', [Validators.required]),
      organization: new FormControl('', [Validators.required]),
      organizationId: new FormControl(''),
      contract: new FormControl('', [
        Validators.required,
        Validators.minLength(10)
      ])
    });
  }

  private loadCustomerData(): void {
    this.route.params.subscribe(params => {
      this.customerId = +params['id'];
      
      if (this.customerId) {
        this.isLoading = true;
        this.customerService.getCustomerById(this.customerId).subscribe({
          next: (customer) => {
            this.customerUpdateForm.patchValue(customer);
            this.isLoading = false;
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = 'Failed to load customer data';
            console.error('Error fetching customer', error);
          }
        });
      }
    });
  }

  private setupOrganizationListener(): void {
    this.customerUpdateForm.get('organization')?.valueChanges.subscribe(org => {
      this.setOrganizationId(org);
    });
  }

  private setOrganizationId(organization: string): void {
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

  onCustomerUpdate(): void {
    if (this.customerUpdateForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      const customerData = this.customerUpdateForm.value;
      
      this.customerService.updateCustomer(this.customerId, customerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Customer Updated Successfully', response);
          this.router.navigate(['/customers']); // Navigate to customer list
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to update customer';
          console.error('Error updating customer', error);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.customerUpdateForm.controls).forEach(field => {
        const control = this.customerUpdateForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }

  // Optional: Method to handle cancel action
  onCancel(): void {
    this.router.navigate(['/customers']);
  }

}
