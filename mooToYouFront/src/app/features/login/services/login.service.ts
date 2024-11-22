import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { Observable } from 'rxjs';
import { LoginReponse } from '../interfaces/loginResponse.interface';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(private http: HttpClient) {}

  loginUser(newUserLogin:LoginRequest):Observable<LoginReponse> {
    return this.http.post<LoginReponse>(`${environment.snbUrl}/auth/login`,newUserLogin);
  }

  fakeUsersCreation(payload:any)
  {
    return this.http.post(`${environment.snbUrl}/faker`,payload)
  }

  // deleteFakeUsersAll(payload:any)
  // {
  //    return this.http.delete(`${environment.snbUrl}/faker/deleteAll`,payload)
  // }
}
