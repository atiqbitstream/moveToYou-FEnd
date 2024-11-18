import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-rider',
  standalone: true,
  imports: [RouterOutlet,RouterModule],
  templateUrl: './rider.component.html',
  styleUrl: './rider.component.css'
})
export class RiderComponent {

}
