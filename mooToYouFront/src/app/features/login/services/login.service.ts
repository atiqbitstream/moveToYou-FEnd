import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { Observable,tap } from 'rxjs';
import { LoginReponse } from '../interfaces/loginResponse.interface';
import { environment } from '../../../../environments/environment';
import { TokenService } from '../../shared/services/token.service';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(private http: HttpClient, private tokenService:TokenService) {}

  loginUser(newUserLogin:LoginRequest):Observable<LoginReponse> {
    return this.http.post<LoginReponse>(`${environment.snbUrl}/auth/login`,newUserLogin).pipe(
      tap(response=>{
         this.tokenService.setAuthData(response);
      })
    );
  }

  fakeUsersCreation(payload:any)
  {
    return this.http.post(`${environment.snbUrl}/faker`,payload)
  }


  getUserIdFromLocalStorage():number|null
{
  const authData = localStorage.getItem('authData');
  if (authData) {
    const parsedData = JSON.parse(authData);
    return parsedData.user?.id || null; // Return the user id if present
  }
  return null;
}
}


