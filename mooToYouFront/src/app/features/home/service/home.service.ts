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


  getUserRole()
  {
   const storeduserData = localStorage.getItem('authData');

   let userRole=''
   if(storeduserData){
   const parsedData=JSON.parse(storeduserData);
   userRole = parsedData.user.role;
   }

   return userRole; 

  }
}