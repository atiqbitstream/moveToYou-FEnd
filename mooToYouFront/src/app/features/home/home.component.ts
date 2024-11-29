import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SubscriptionLoggable } from 'rxjs/internal/testing/SubscriptionLoggable';
import { HomeService } from './service/home.service';
import { response } from 'express';
import { ERole } from '../shared/enums/roles.enum';

@Component({
  changeDetection:ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
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
    {path:'/customers', label:'Go To Customers Module'},
    {path:'/riders',label:'Go To Riders Module'},
    {path:'', label:'Login Again'}
  ]

  

  onLogOut()
  {
    this.homeService.logOut();
  }

  


}
