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
    return this.http.post<LoginReponse>(`${environment.apiUrl}/auth/login`,newUserLogin);
  }
}
