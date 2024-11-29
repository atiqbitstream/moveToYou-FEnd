import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({providedIn: 'root'})
export class HomeService
{
  constructor(private http:HttpClient){}

  logOut()
  {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    sessionStorage.clear();

    return this.http.post(`${environment.snbUrl}/user/logout`,{});
  }
}