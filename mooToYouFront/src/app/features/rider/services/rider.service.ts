
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { createRider } from "../interfaces/riderCreate.interface";
import { environment } from "../../../../environments/environment";
import { RiderCreateRes } from "../interfaces/riderResponse.interface";
import { Observable } from "rxjs";
import { Rider } from "../interfaces/rider.interface";
import { LoginService } from "../../login/services/login.service";

@Injectable({providedIn:"root"})
export class RiderService
{
  constructor(private http:HttpClient, private loginService:LoginService){}

  createAsRider(newRider:createRider):Observable<RiderCreateRes>
  {
    return this.http.post<RiderCreateRes>(`${environment.snbUrl}/user/createAsRider`,newRider)
  }

  getAllRiders():Observable<Rider[]>
  {
    return this.http.get<Rider[]>(`${environment.snbUrl}/rider/getAllRiders`)
  }

  getRider():Observable<Rider>
  {
    const currentRiderId=this.loginService.getUserIdFromLocalStorage();
   return this.http.get<Rider>(`${environment.snbUrl}/user/getAsRider/${currentRiderId}`)
  }
}