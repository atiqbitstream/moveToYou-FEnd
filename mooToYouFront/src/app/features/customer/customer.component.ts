import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [RouterLink,  MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent {

}
