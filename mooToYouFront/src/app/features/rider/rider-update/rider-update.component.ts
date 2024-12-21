import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ERole } from '../../shared/enums/roles.enum';
import { RiderService } from '../services/rider.service';
import { catchError, of, switchMap } from 'rxjs';
import { response } from 'express';
import { ActivatedRoute, Route, Router } from '@angular/router';

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  sector: string;
  street: string;
  cnicNumber: string;
  email: string;
  role: string;
  organization: string;
  organizationId: number;
}

@Component({
  selector: 'app-rider-update',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './rider-update.component.html',
  styleUrl: './rider-update.component.css',
})
export class RiderUpdateComponent implements OnInit {
  isLoading = false;
  riderId!:number;
  roles = Object.values(ERole);

  riderUpdateForm!: FormGroup;

  constructor(private fb: FormBuilder, private riderService:RiderService, private snackbar: MatSnackBar, private router:Router, private route:ActivatedRoute) {
    this.createForm();
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params=>{
        this.riderId=+params['id'];
        return this.riderService.getRider(this.riderId);
      }),
      catchError(error=>{
        this.snackbar.open('Error loading rider data','close',{duration:3000});
        this.router.navigate(['/riders']);
        return of(null);
      })
    ).subscribe((rider:User | null)=>{
      if(rider)
      {
        this.populateForm(rider)
      }
    })
  }

  private createForm() {
    this.riderUpdateForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      firstName: ['', [Validators.required, Validators.minLength(5)]],
      lastName: ['', [Validators.required, Validators.minLength(5)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
      address: ['', [Validators.maxLength(50)]],
      sector: ['', [Validators.maxLength(10)]],
      street: [''],
      cnicNumber: ['', [
        Validators.pattern('^[0-9]{5}-[0-9]{7}-[0-9]$')
      ]],
      email: ['', [
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      ]],
      role: ['', Validators.required],
      organization: ['', Validators.required],
      organizationId: ['']
    });
  }

  private populateForm(rider:User)
  {
    this.riderUpdateForm.patchValue({
      username:rider.username,
      firstName:rider.firstName,
      lastName:rider.lastName,
      phoneNumber:rider.phoneNumber,
      address:rider.address,
      sector:rider.sector,
      street:rider.street,
      cnicNumber:rider.cnicNumber,
      email:rider.email,
      role:rider.email,
      organization:rider.organization,
      organizationId:rider.organizationId
    })
  }

  // Getter methods for form controls
  get username() {
    return this.riderUpdateForm.get('username');
  }
  get firstName() {
    return this.riderUpdateForm.get('firstName');
  }
  get lastName() {
    return this.riderUpdateForm.get('lastName');
  }
  get phoneNumber() {
    return this.riderUpdateForm.get('phoneNumber');
  }
  get address() {
    return this.riderUpdateForm.get('address');
  }
  get sector() {
    return this.riderUpdateForm.get('sector');
  }
  get street() {
    return this.riderUpdateForm.get('street');
  }
  get cnicNumber() {
    return this.riderUpdateForm.get('cnicNumber');
  }
  get email() {
    return this.riderUpdateForm.get('email');
  }
  get password() {
    return this.riderUpdateForm.get('password');
  }
  get role() {
    return this.riderUpdateForm.get('role');
  }

  onRiderUpdate()
   {
    if(this.riderUpdateForm.valid)
    {
      this.isLoading=true;
      const updateRider = this.riderUpdateForm.value;

      this.riderService.updateRider(this.riderId,updateRider).pipe(
        catchError(error=>{
          this.snackbar.open('Error updating rider','close',{duration:3000});
          return of(null);
        })
      ).subscribe(response=>{
        this.isLoading=false;
        if(response)
        {
          this.snackbar.open('Rider updated successfully','closed',{duration:3000})
          this.router.navigate(['/riders'])
        }
      })
    }else
    {
      this.snackbar.open('Pleae fix the form errors before Submitting ', 'close', {duration:3000})
    }
   }
}
