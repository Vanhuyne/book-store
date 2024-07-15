import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { CartService } from '../../service/cart.service';
import { environment } from '../../../environments/environment';
import { UserDTO } from '../../models/auth/user-dto';


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
  profilePictureUrl = environment.apiUrl + '/auth/uploads/' ;
  user! : UserDTO ;

  constructor(
    private sharedService: SharedService,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadCartItemCount();
    this.getUsername();
    this.cartService.getCartCount().subscribe((count) => {
      this.cartItemCount = count;  // Update the cart item count      
    });
    
  }

  getUsername(): void {
    this.authService.getUser().subscribe((user) => {
      if (user) {
        this.username = user.username;
        this.user = user;
        
      }
    });
  }

  searchProducts(event: Event): void {
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

