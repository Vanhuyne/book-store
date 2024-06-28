import { Component, OnInit } from '@angular/core';

import { ProductService } from '../../service/product.service';
import { Page } from '../../shared/dto/page';
import { Product } from '../../shared/dto/product';
import { CartService } from '../../service/cart.service';
import { Category } from '../../shared/dto/category';
import { Subscription } from 'rxjs';
import { SharedService } from '../../service/shared.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{
  products: Product[] = [];
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 5;
  pageNumbers: number[] = [];
  selectedCategory: string | null = null;
  categories: Category[] = [];


  constructor(
    private productService: ProductService , 
    private cartService : CartService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();

    this.sharedService.searchKeyword$.subscribe(keyword => {
      this.searchProducts(keyword);
    });
  }

  loadProducts(page: number = 0, size : number =  this.pageSize ): void {
    this.productService.getAllProducts(page, size, this.selectedCategory || undefined).subscribe((data: Page<Product>) => {
      this.products = data.content;
      console.log(this.products);
      this.totalPages = data.totalPages;
      this.currentPage = data.number;
      this.pageNumbers = Array.from({length: this.totalPages}, (_, k) => k);
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
      console.log(this.categories.map(c => c.name));
      
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 0; // Reset to first page when filtering
    this.loadProducts();
  }
  addToCart(productId: number) {
    const userId = 1; // Replace with a valid user ID
    const quantity = 1; // Default quantity to add to cart

    this.cartService.addProductToCart(userId, productId, quantity).subscribe({
      next: (cart) => console.log('Product added to cart', cart),
      error: (err) => console.error('Error adding product to cart:', err)
    });
  }

  nextPage() :void {
    if(this.currentPage + 1 < this.totalPages) {
      this.loadProducts(this.currentPage + 1);
    }
  }

  previousPage() :void {
    if(this.currentPage > 0) {
      this.loadProducts(this.currentPage - 1);
    }
  }

  goToPage(page: number): void {
    this.loadProducts(page);
  }

  showAllProducts(): void {
    this.selectedCategory = null; 
    this.loadProducts(); // Reload all products
  }

  searchProducts(keyword: string, page: number = 0, size: number = this.pageSize): void {
    this.productService.searchProducts(keyword, page, size).subscribe((data: Page<Product>) => {
      this.products = data.content;
      this.totalPages = data.totalPages;
      this.currentPage = data.number;
      this.pageNumbers = Array.from({ length: this.totalPages }, (_, k) => k);
    });
  }

}
