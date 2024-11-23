import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RiderService } from '../services/rider.service';
import { response } from 'express';
import { error } from 'console';
import { Rider } from '../interfaces/rider.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rider-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './rider-list.component.html',
  styleUrl: './rider-list.component.css'
})
export class RiderListComponent implements OnInit {

  ngOnInit(): void {
    this.onGetAllRiders();
    this.getCurrentRider();
  }

  riders:Rider[]=[];
  currentRider!:Rider;
  showAllRiders: boolean = true; 


  constructor(private riderService:RiderService){}


  onGetAllRiders()
  {
    this.riderService.getAllRiders().subscribe({
      next:(response)=>{
        console.log("Here are all the riders from MTUB : ",response)
        this.riders=response;
      },
      error:(err)=>{
        console.log("The error from MTUB is : ",err)
      }
    })
  }

  getCurrentRider()
  {
    this.riderService.getRider().subscribe({
      next:(response)=>{
        console.log("The current rider is : ",response)
        this.currentRider=response;
      },
      error:(err)=>{
        console.log("Error from getting current rider is : ",err)
      }
    })
  }

  toggleShowMyProfile()
  {
    this.showAllRiders=!this.showAllRiders;
  }

}
