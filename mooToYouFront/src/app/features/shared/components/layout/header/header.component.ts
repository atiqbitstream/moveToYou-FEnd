import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatBadgeModule} from '@angular/material/badge';
import { MaterialService } from '../../../services/material.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule,MatSidenavModule, MatSlideToggleModule,MatBadgeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private sidenavService: MaterialService) {}

  // Method to toggle the sidenav when the menu button is clicked
  toggleSidenav() {
    this.sidenavService.toggleSidenav();
  }
}
