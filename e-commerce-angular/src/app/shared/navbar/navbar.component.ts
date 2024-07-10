import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { CartService } from '../../service/cart.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  keyword: string = '';
  username: string | null = null;
  isDropdownOpen: boolean = false;
  cartItemCount: number = 0;

  constructor(
    private sharedService: SharedService,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.getUsername();
    this.loadCartItemCount();

    console.log(this.cartItemCount);
    

    this.cartService.getCartCount().subscribe((count) => {
      this.cartItemCount = count;  // Update the cart item count

      console.log('Cart item count: ', this.cartItemCount);
      
    });
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

