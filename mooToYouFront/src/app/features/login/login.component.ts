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
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule],
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
        // Use a single pattern validator that matches at least one of each type
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/),
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
