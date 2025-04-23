import { RouteOrderItem } from './../interfaces/types';

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { createRider } from "../interfaces/riderCreate.interface";
import { environment } from "../../../../environments/environment";
import { RiderCreateRes } from "../interfaces/riderResponse.interface";
import { catchError, Observable, tap, throwError } from "rxjs";
import { Rider } from "../interfaces/rider.interface";
import { LoginService } from "../../login/services/login.service";

import { Customer } from "../../customer/customer-update/customer-update.component";


import { FormArray } from "@angular/forms";
import { Product, CreateDeliveryItems } from "../../shared/models/types";
import { User } from "../interfaces/user.interface";
import { DailyDelivery, DailyDeliverynCustomer } from "../interfaces/types";
import { LoggerService } from "../../shared/services/logger.service";

@Injectable({providedIn:"root"})
export class RiderService
{
  constructor(private http:HttpClient, private loginService:LoginService, private logger:LoggerService){}

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

  getDailyDelveries():Observable<DailyDeliverynCustomer[]>
  {
    return this.http.get<DailyDeliverynCustomer[]>(`${environment.mtuUrl}/rider/getDailyDelivery`);
  }

  getDailyDelveriesWithItems(): Observable<DailyDelivery[]> {
    const url = `${environment.mtuUrl}/rider/getDailyDeliveryWithItems`;
    this.logger.info('Fetching daily deliveries with items from', url);

    return this.http.get<DailyDelivery[]>(url).pipe(
      tap((deliveries) => {
        this.logger.info('Fetched daily deliveries successfully', {
          count: deliveries.length,
          url,
        });
      }),
      catchError((error) => {
        this.logger.error('Failed to fetch daily deliveries', {
          url,
          error,
        });
        return throwError(() => error);
      })
    );
  }


  getProducts():Observable<Product[]>
  {
    return this.http.get<Product[]>(`${environment.mtuUrl}/rider/getAllProducts`);
  }

  
  addDeliveryItems(newDeliveryItems:CreateDeliveryItems)
  {
   return this.http.post(`${environment.mtuUrl}/rider/createDeliveryItem`,newDeliveryItems)
  }


//   updateRouteOrder(newRouteData:RouteOrderItem[])
//   {
// return this.http.patch<RouteOrderItem>(`${environment.mtuUrl}/rider/updateRoutes`,newRouteData)
//   }

updateRouteOrder(newRouteData: RouteOrderItem[]): Observable<RouteOrderItem> {
  const url = `${environment.mtuUrl}/rider/updateRoutes`;
  this.logger.info('Sending route update request', {
    url,
    payload: newRouteData,
  });

  return this.http.patch<RouteOrderItem>(url, newRouteData).pipe(
    tap(() => {
      this.logger.info('Route order updated successfully', {
        url,
        payloadSize: newRouteData.length,
      });
    }),
    catchError((error) => {
      this.logger.error('Failed to update route order', {
        url,
        error,
      });
      return throwError(() => error);
    })
  );
}

}