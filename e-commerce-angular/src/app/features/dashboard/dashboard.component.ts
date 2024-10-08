import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent  implements OnInit {
  route : string = 'orders';
  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateTo(route: string): void {

    this.route = route;
    this.router.navigate(['/admin', route]);
  }
}
