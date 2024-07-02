import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  keyword: string = '';
  username: string | null = null;
  isDropdownOpen: boolean = false;

  constructor(
    private sharedService: SharedService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUsername();
   
  }
  
  getUsername(): void {
    this.username = this.authService.getUsernameFromToken();
  }
  
  searchProducts(event: Event): void {
    event.preventDefault();
    this.sharedService.setSearchKeyword(this.keyword);
  }
  
  logout(): void {
    this.authService.logout();
    this.authService.clearUser();
    this.username = null;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }
}
