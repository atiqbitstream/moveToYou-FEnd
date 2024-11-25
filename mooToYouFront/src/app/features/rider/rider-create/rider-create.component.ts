import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RiderService } from '../services/rider.service';
import { createRider } from '../interfaces/riderCreate.interface';
import { response } from 'express';
import { ERole } from '../enums/roles.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rider-create',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,CommonModule],
  templateUrl: './rider-create.component.html',
  styleUrl: './rider-create.component.css'
})
export class RiderCreateComponent implements OnInit{

  riderCreationForm!:FormGroup;

  roles=Object.values(ERole);

  constructor(private riderService:RiderService){}

  ngOnInit(): void {
    this.riderCreationForm= new FormGroup({
      username:new FormControl('',[
        Validators.required,
        Validators.minLength(5),
      ]),
      firstName : new FormControl('',[
        Validators.required,
        Validators.minLength(5),
      ]),
      lastName : new FormControl('',[
        Validators.required,
        Validators.minLength(5)
      ]),
      phoneNumber: new FormControl('',[
        Validators.required,
        Validators.minLength(11),
        Validators.pattern(/[0-9]/)
      ]),
      address:new FormControl('',[
        Validators.required,
        Validators.maxLength(50)
      ]),
      sector:new FormControl('',[
        Validators.required,
        Validators.maxLength(10)
      ]),
      cnicNumber:new FormControl('',[
        Validators.required,
        Validators.minLength(13),
        Validators.pattern('^\\d{5}-\\d{7}-\\d{1}$')
      ]),
      email:new FormControl('',[
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/),
        Validators.pattern(/[0-9]/),
        Validators.pattern(/[\!@#\^\&*\)\(+=_-]/),
      ]),
      role:new FormControl('',[
         Validators.required
      ]),
      street:new FormControl('',[
        Validators.required,
        Validators.minLength(10)
      ]),
    })
  }

  get username()
  {
    return this.riderCreationForm.get('username')
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

  get email()
  {
    return this.riderCreationForm.get('email')
  }

  get role()
  {
    return this.riderCreationForm.get('role');
  }

  get password()
  {
    return this.riderCreationForm.get('password')
  }

  onRiderCreate()
  {

    if(this.riderCreationForm.valid)
    {
      const  riderCreateData:createRider=this.riderCreationForm.value;

      this.riderService.createAsRider(riderCreateData).subscribe(
      {
        next:(response)=>{
          console.log("The Rider is created succesfully in the MTU backend",response);
        }
      }
      )
    }
  
  }

}

