
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { createRider } from "../interfaces/riderCreate.interface";
import { environment } from "../../../../environments/environment";

@Injectable({providedIn:"root"})
export class RiderService
{
  constructor(private http:HttpClient){}

  createRider(newRider:createRider)
  {
    return this.http.post(`${environment.mtuUrl}/rider/create`,newRider)
  }
}