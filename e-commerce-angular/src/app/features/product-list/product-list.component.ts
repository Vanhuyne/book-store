import { Component, OnInit } from '@angular/core';

import { ProductService } from '../../service/product.service';
import { Page } from '../../shared/dto/page';
import { Product } from '../../shared/dto/product';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{
  products: Product[] = [];
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;

  constructor(private productService: ProductService , private cartService : CartService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(page: number = 0, size: number = 10): void {
    this.productService.getAllProducts(page, size).subscribe((data: Page<Product>) => {
      
      this.products = data.content;
      console.log(this.products);
      this.totalPages = data.totalPages;
      this.currentPage = data.number;
    });
  }

  addToCart(productId: number) {
    const userId = 1; // Replace with a valid user ID
    const quantity = 1; // Default quantity to add to cart

    this.cartService.addProductToCart(userId, productId, quantity).subscribe({
      next: (cart) => console.log('Product added to cart', cart),
      error: (err) => console.error('Error adding product to cart:', err)
    });
  }

}
