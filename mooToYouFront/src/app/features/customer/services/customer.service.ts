import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ICustomerCreation } from "../interfaces/customerCreate.interface";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

@Injectable({providedIn:"root"})
export class CustomerService
{
  constructor(private http:HttpClient){}

  customerCreate(newCustomer:ICustomerCreation):Observable<ICustomerCreation>
  {
     return this.http.post<ICustomerCreation>(`${environment.mtuUrl}/customer/create`,newCustomer)
  }

  
}