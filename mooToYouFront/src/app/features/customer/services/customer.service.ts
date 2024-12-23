import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ICustomer, ICustomerCreation } from "../interfaces/customerCreate.interface";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Customer } from "../customer-update/customer-update.component";

@Injectable({providedIn:"root"})
export class CustomerService
{
  constructor(private http:HttpClient){}

  customerCreate(newCustomer:ICustomerCreation):Observable<ICustomerCreation>
  {
     return this.http.post<ICustomerCreation>(`${environment.mtuUrl}/customer/create`,newCustomer)
  }


  fetchCustomersByOrganization(organizationId:number):Observable<any[]>
  {
     return this.http.get<any[]>(`${environment.mtuUrl}/customer/getAllCustomers`,{
      params:{organizationId:organizationId}
     })
  }

  fetchCustomer(customerId:number):Observable<Customer>
  {
   return this.http.get<Customer>(`${environment.mtuUrl}/customer/getCustomer`,{params:{customerId}})
  }

  updateCustomer(id:number, updatedCustomer:ICustomerCreation)
  {
   console.log("updateCustomer called")
     return this.http.patch(`${environment.mtuUrl}/customer/update/${id}`,updatedCustomer)
  }

  assignCustomerToRider(payload: { riderId: number; customerId: number }): Observable<any> {
   return this.http.post(
     `${environment.mtuUrl}/rider/assignCustomer/${payload.riderId}`,
     { customerId: payload.customerId }
   );
 }

  softDeleteCustomer(customerId:number)
  {
  return this.http.delete(`${environment.mtuUrl}/customer/delete/${customerId}`)
  }

  
}