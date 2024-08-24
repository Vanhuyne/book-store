import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { AuthService } from '../../service/auth.service';
import {  Event, NavigationEnd, Router } from '@angular/router';

import { CartService } from '../../service/cart.service';
import { environment } from '../../../environments/environment';
import { UserDTO } from '../../models/auth/user-dto';
import {  filter, Subscription } from 'rxjs';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit , OnDestroy {
  keyword: string = '';
  username: string | null = null;
  isDropdownOpen: boolean = false;
  cartItemCount: number = 0;
  user! : UserDTO ;
  isAdmin: boolean = false;
  isAdminRoute: boolean = false;
  private routerSubscription: Subscription | undefined;

  constructor(
    private sharedService: SharedService,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadCartItemCount();
    this.getUsername();
    this.checkAdminRole();
    this.setupRouterListener();
    this.cartService.getCartCount().subscribe((count) => {
      this.cartItemCount = count;  // Update the cart item count      
    });
    
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  getUsername(): void {
    this.authService.getUser().subscribe((user) => {
      if (user) {
        this.username = user.username;
        this.user = user;
        this.checkAdminRole();
      }
    });
  }

  checkAdminRole(): void {
    const roles = this.authService.getUserRolesFromToken();
    this.isAdmin = roles.includes('ROLE_ADMIN');
  }

  setupRouterListener(): void {
    this.routerSubscription = this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isAdminRoute = event.urlAfterRedirects.startsWith('/admin');
    });
  }

  searchProducts(event: any): void {
    event.preventDefault();
    this.sharedService.setSearchKeyword(this.keyword);
  }

  logout(): void {
    this.authService.logout();
    this.authService.clearUser();
    this.username = null;
    this.router.navigate(['/login']);
  }

  loadCartItemCount(): void {
    this.authService.loadUserDetails().subscribe((user) => {
      if (user) {
        this.cartService.updateCartCount(user.userId);
      }
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }
}

