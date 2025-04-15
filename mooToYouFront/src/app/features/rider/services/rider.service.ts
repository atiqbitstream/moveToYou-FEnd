
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { createRider } from "../interfaces/riderCreate.interface";
import { environment } from "../../../../environments/environment";
import { RiderCreateRes } from "../interfaces/riderResponse.interface";
import { Observable } from "rxjs";
import { Rider } from "../interfaces/rider.interface";
import { LoginService } from "../../login/services/login.service";

import { Customer } from "../../customer/customer-update/customer-update.component";
import {RouteASC} from "../daily-delivery/daily-delivery.component"
import {  DailyDeliveryWithCustomer, DailyDeliveryWithCustomernDeliveryItems } from "../daily-delivery/daily-delivery.component";

import { FormArray } from "@angular/forms";
import { Product, CreateDeliveryItems } from "../../shared/models/types";
import { User } from "../interfaces/user.interface";

@Injectable({providedIn:"root"})
export class RiderService
{
  constructor(private http:HttpClient, private loginService:LoginService){}

  createAsRider(newRider:createRider):Observable<RiderCreateRes>
  {
    return this.http.post<RiderCreateRes>(`${environment.snbUrl}/user/createAsRider`,newRider)
  }

  getAllRiders(organizationId:number):Observable<any[]>
  {
    return this.http.get<any[]>(`${environment.snbUrl}/user/getAllRiders`,{
      params:{organizationId:organizationId}
     })
  }

  getRider(riderId:number):Observable<Rider | null>
  {
   return this.http.get<Rider | null>(`${environment.snbUrl}/user/getAsRider`,{
    params:{riderId:riderId}
   })
  }

  updateRider(id:number, rider:Partial<User>)
  {
   return this.http.patch<User>(`${environment.snbUrl}/user/updateRider/${id}`,rider)
  }

  softDeleteRider(riderId:number)
  {
    return this.http.delete(`${environment.snbUrl}/user/deleteRider/${riderId}`)
  }

  getAssignedCustomersForRider(riderId:number):Observable<Customer[]>
  {
    return this.http.get<Customer[]>(`${environment.mtuUrl}/rider/getAssignedCustomers/${riderId}`)
  }

  assignDailyDelivery(customerId:number)
  {
    return this.http.post(`${environment.mtuUrl}/rider/createDailyDelivery`,{customerId})
  }

  getDailyDelveries():Observable<DailyDeliveryWithCustomer[]>
  {
    return this.http.get<DailyDeliveryWithCustomer[]>(`${environment.mtuUrl}/rider/getDailyDelivery`);
  }

  getDailyDelveriesWithItems():Observable<DailyDeliveryWithCustomernDeliveryItems[]>
  {
    return this.http.get<DailyDeliveryWithCustomernDeliveryItems[]>(`${environment.mtuUrl}/rider/getDailyDeliveryWithItems`)
  }

  getProducts():Observable<Product[]>
  {
    return this.http.get<Product[]>(`${environment.mtuUrl}/rider/getAllProducts`);
  }

  
  addDeliveryItems(newDeliveryItems:CreateDeliveryItems)
  {
   return this.http.post(`${environment.mtuUrl}/rider/createDeliveryItem`,newDeliveryItems)
  }


  updateRouteOrder(newRouteData:RouteASC[])
  {
return this.http.patch<RouteASC>(`${environment.mtuUrl}/rider/updateRoutes`,newRouteData)
  }
}