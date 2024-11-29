import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ERole } from "../enums/roles.enum";
import { error } from "console";

@Injectable({providedIn:'root'})
export class AuthService
{
    constructor(private http:HttpClient){}

    

    getUserRole():ERole
    {
       const storedData = localStorage.getItem('authData');

       let userRole:ERole=ERole.DEFAULT;

       if(storedData)
       {
        const parsedData = JSON.parse(storedData);
        if(parsedData.user && parsedData.user.role){
        userRole= parsedData.user.role;
        }
        
       }

      return userRole;
       
    }
}