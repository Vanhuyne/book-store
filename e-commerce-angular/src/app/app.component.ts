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
  showHeaderFooter = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    initFlowbite();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const noHeaderFooterRoutes = ['/login', '/register' ,'/reset-password', '/request-password-reset'];
        this.showHeaderFooter = !noHeaderFooterRoutes.includes(event.url);
      }
    });
  }
}
