import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from '../../../../login/login.component';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {

}
