import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { Observable,tap } from 'rxjs';
import { LoginReponse } from '../interfaces/loginResponse.interface';
import { environment } from '../../../../environments/environment';
import { TokenService } from '../../shared/services/token.service';
import { ApiService } from '../../shared/generics/api.service';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(private http: HttpClient, private tokenService:TokenService, private apiService:ApiService<LoginRequest>) {}

  loginUser(newUserLogin:LoginRequest):Observable<LoginReponse> {
    return this.apiService.create<LoginRequest,LoginReponse>('auth/login',newUserLogin).pipe(
      tap(response=>{
         this.tokenService.setAuthData(response);
      })
    );
  }

  fakeUsersCreation(payload:any):Observable<any>
  {
    return this.apiService.create('faker',payload)
  }


  getUserIdFromLocalStorage()
{
  const authData = localStorage.getItem('authData');
  if (authData) {
    const parsedData = JSON.parse(authData);
    return parsedData.user?.id || null; // Return the user id if present
  }
  
}
}


