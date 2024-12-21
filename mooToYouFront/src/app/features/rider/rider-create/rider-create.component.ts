import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { RiderService } from '../services/rider.service';
import { createRider } from '../interfaces/riderCreate.interface';
import { response } from 'express';
import { ERole } from '../../shared/enums/roles.enum';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-rider-create',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './rider-create.component.html',
  styleUrl: './rider-create.component.css',
})
export class RiderCreateComponent implements OnInit {
  riderCreationForm!: FormGroup;

  roles = Object.values(ERole);

  constructor(private riderService: RiderService) {}

  ngOnInit(): void {
    this.riderCreationForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      firstName: new FormControl('', [
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
        Validators.maxLength(50),
      ]),
      sector: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
      ]),
      cnicNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(13),
        Validators.pattern('^\\d{5}-\\d{7}-\\d{1}$'),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$'),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/),
        Validators.pattern(/[0-9]/),
        Validators.pattern(/[\!@#\^\&*\)\(+=_-]/),
      ]),
      role: new FormControl('', [Validators.required]),
      street: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),

      organization: new FormControl('', [
        Validators.required,
  
      ]),

      organizationId: new FormControl(''),
    });

    this.riderCreationForm
      .get('organization')
      ?.valueChanges.subscribe((org) => {
        this.setOrganizationId(org);
      });
  }

  get username() {
    return this.riderCreationForm.get('username');
  }

  get firstName() {
    return this.riderCreationForm.get('firstName');
  }

  get lastName() {
    return this.riderCreationForm.get('lastName');
  }

  get phoneNumber() {
    return this.riderCreationForm.get('phoneNumber');
  }

  get address() {
    return this.riderCreationForm.get('address');
  }

  get sector() {
    return this.riderCreationForm.get('sector');
  }

  get cnicNumber() {
    return this.riderCreationForm.get('cnicNumber');
  }

  get street() {
    return this.riderCreationForm.get('street');
  }

  get email() {
    return this.riderCreationForm.get('email');
  }

  get role() {
    return this.riderCreationForm.get('role');
  }

  get organization() {
    return this.riderCreationForm.get('organization');
  }
  
  get organizationId() {
    return this.riderCreationForm.get('organizationId');
  }

  get password() {
    return this.riderCreationForm.get('password');
  }

  setOrganizationId(organization: string) {
    switch (organization) {
      case 'emaanDairy':
        this.riderCreationForm.get('organizationId')?.setValue(1);
        break;

      case 'newDairy':
        this.riderCreationForm.get('organizationId')?.setValue(2);
        break;
      default:
        this.riderCreationForm.get('organizationId')?.setValue(null);
        break;
    }
  }

  onRiderCreate() {
    if (this.riderCreationForm.valid) {
      const riderCreateData: createRider = this.riderCreationForm.value;

      this.riderService.createAsRider(riderCreateData).subscribe({
        next: (response) => {
          console.log(
            'The Rider is created succesfully in the MTU backend',
            response
          );
        },
      });
    }
  }
}
