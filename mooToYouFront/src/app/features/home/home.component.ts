import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SubscriptionLoggable } from 'rxjs/internal/testing/SubscriptionLoggable';
import { HomeService } from './service/home.service';
import { response } from 'express';
import { ERole } from '../shared/enums/roles.enum';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';

@Component({
  changeDetection:ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatCardModule, 
    MatButtonModule,MatRippleModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  userRole:string | null=null;

  ngOnInit(): void {
    this.userRole= this.homeService.getUserRole();
  }

  constructor(private homeService:HomeService)
  {
   
  }

 readonly moduleRoutes = [
    {path:'/customers', label:'Go To Customers Section'},
    {path:'/riders',label:'Go To Riders Section'},
    {path:'', label:'Login Again'}
  ]

  

  onLogOut()
  {
    this.homeService.logOut();
  }

  


}
