import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { validateHeaderName } from 'http';
import { LoginService } from './services/login.service';
import { LoginRequest } from './interfaces/loginRequest.interface';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  constructor(private loginService: LoginService, private router:Router) {}

  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/) // Regex for email validation
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/),
        Validators.pattern(/[0-9]/),
        Validators.pattern(/[\!@#\^\&*\)\(+=_-]/),
      ]),
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get email()
  {
    return this.loginForm.get('email')
  }

  onUserLogin() {
    if (this.loginForm.valid) {
      const loginRequest: LoginRequest = this.loginForm.value;

      this.loginService.loginUser(loginRequest).subscribe({
        next: (response) => {
          console.log(response);
          this.router.navigate(['/home'])
        },
        error: (err) => {
          console.log('Login failed', err);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }

  payload:any;

  onCreateFakeUsers()
  {
    console.log("function createfakeusers called")
    this.loginService.fakeUsersCreation(this.payload).subscribe({
      next:(response)=>{
        console.log(response);
      },
      error:(err)=>{
        console.log("fake users creation error : ",err)
      }
    });
    
  }


}
