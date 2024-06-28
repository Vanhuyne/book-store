import { Component } from '@angular/core';
import { Product } from '../dto/product';
import { ProductService } from '../../service/product.service';
import { SharedService } from '../../service/shared.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  keyword: string = '';

  constructor(private sharedService: SharedService) {}

  searchProducts(event: Event): void {
    event.preventDefault();
    this.sharedService.setSearchKeyword(this.keyword);
  }
  
}
