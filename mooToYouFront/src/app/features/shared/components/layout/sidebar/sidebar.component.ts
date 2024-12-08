import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import { Subscription } from 'rxjs';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatRippleModule} from '@angular/material/core';
import { MaterialService } from '../../../services/material.service';

@Component({
  selector: 'app-sidebar',
  standalone:true,
  imports: [MatSidenavModule,MatButtonModule,MatFormFieldModule, MatSelectModule,MatIconModule, MatRippleModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  showFiller = false;

  @ViewChild('drawer', { static: false }) drawer!: MatDrawer; // Reference to the drawer
  private subscription!: Subscription;

  constructor(private sidenavService: MaterialService) {}

  ngOnInit() {
    // Subscribe to the toggle event from the service
    this.subscription = this.sidenavService.toggleSidenav$.subscribe(() => {
      this.drawer.toggle();
    });
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
