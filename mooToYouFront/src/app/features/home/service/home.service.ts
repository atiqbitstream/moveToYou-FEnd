import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Router } from "@angular/router";


@Injectable({providedIn: 'root'})
export class HomeService
{
  constructor(private http:HttpClient, private router:Router){}

  logOut()
  {
    localStorage.removeItem('authData');
    sessionStorage.clear();
    this.router.navigate(['']);
 
  }
}