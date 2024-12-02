import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ICustomerCreation } from "../interfaces/customerCreate.interface";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { ApiService } from "../../shared/generics/api.service";

@Injectable({providedIn:"root"})
export class CustomerService
{
  constructor(private http:HttpClient, private apiService:ApiService<ICustomerCreation>){}

  customerCreate(newCustomer:ICustomerCreation):Observable<ICustomerCreation>
  {
     return this.apiService.create('customer/create',newCustomer)
  }


  fetchCustomersByOrganization(organizationId:number):Observable<any[]>
  {
     return this.apiService.getAll('customer/getAllCustomers',{organizationId});
  }

  
}