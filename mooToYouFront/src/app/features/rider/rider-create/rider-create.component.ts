import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RiderService } from '../services/rider.service';
import { createRider } from '../interfaces/riderCreate.interface';
import { response } from 'express';

@Component({
  selector: 'app-rider-create',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule],
  templateUrl: './rider-create.component.html',
  styleUrl: './rider-create.component.css'
})
export class RiderCreateComponent implements OnInit{

  riderCreationForm!:FormGroup;

  constructor(private riderService:RiderService){}

  ngOnInit(): void {
    this.riderCreationForm= new FormGroup({
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
      street:new FormControl('',[
        Validators.required,
        Validators.minLength(10)
      ]),
    })
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

  onRiderCreate()
  {

    if(this.riderCreationForm.valid)
    {
      const  riderCreateData:createRider=this.riderCreationForm.value;

      this.riderService.createRider(riderCreateData).subscribe(
      {
        next:(response)=>{
          console.log("The Rider is created succesfully in the MTU backend",response);
        }
      }
      )
    }
  
  }

}

