
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { createRider } from "../interfaces/riderCreate.interface";
import { environment } from "../../../../environments/environment";
import { RiderCreateRes } from "../interfaces/riderResponse.interface";
import { Observable } from "rxjs";
import { Rider } from "../interfaces/rider.interface";
import { LoginService } from "../../login/services/login.service";
import { ApiService } from "../../shared/generics/api.service";

@Injectable({providedIn:"root"})
export class RiderService
{
  constructor(private http:HttpClient, private loginService:LoginService, private apiService:ApiService<Rider>){}

  createAsRider(newRider:createRider):Observable<RiderCreateRes>
  {
    return this.apiService.create<createRider,RiderCreateRes>('user/createAsRider',newRider)
  }

  getAllRiders():Observable<Rider[]>
  {
    return this.apiService.getAll('rider/getAllRiders') 
  }

  getRider():Observable<Rider>
  {
    const currentRiderId=this.loginService.getUserIdFromLocalStorage();
   return this.apiService.getById('rider/profile/',currentRiderId);
  }
}