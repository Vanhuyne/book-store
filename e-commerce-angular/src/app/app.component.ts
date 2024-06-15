import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit  {
  title = 'E-commerce-angular';
  ngOnInit(): void {
    initFlowbite();
  }

  showHeaderFooter: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Define the routes where you don't want to show header and footer
        const noHeaderFooterRoutes = ['/login', '/register'];
        this.showHeaderFooter = !noHeaderFooterRoutes.includes(event.url);
      }
    });
  }
}
