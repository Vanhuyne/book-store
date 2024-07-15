import { Component, OnInit } from '@angular/core';

import { ProductService } from '../../service/product.service';
import { Page } from '../../models/page';
import { Product } from '../../models/product';
import { CartService } from '../../service/cart.service';
import { Category } from '../../models/category';
import { SharedService } from '../../service/shared.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{
  products: Product[] = [];
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 8;
  pageNumbers: number[] = [];
  selectedCategory: string | null = null;
  categories: Category[] = [];
  minPrice: number = 0;
  maxPrice: number = 1000;
  minStockQuantity: number = 0;
  totalResults: number | null = null;

  constructor(
    private productService: ProductService , 
    private cartService : CartService,
    private sharedService: SharedService,
    private authService: AuthService,
    private router: Router
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
      this.totalPages = data.totalPages;
      this.currentPage = data.number;
      this.pageNumbers = Array.from({length: this.totalPages}, (_, k) => k);
      this.totalResults = data.totalElements;
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 0; // Reset to first page when filtering
    this.loadProducts();
  }

  addToCart(productId: number) {
   this.authService.getUser().subscribe(user => {
    if(user){
      const userId = user.userId;
      const quantity = 1; // Default quantity to add to cart
      this.cartService.addProductToCart(userId, productId, quantity).subscribe({
        next: (cart) => console.log('Product added to cart', cart),
        error: (err) => console.error('Error adding product to cart:', err)
      });
    }else {
      console.error('User not logged in. Cannot add product to cart');
      this.router.navigate(['/login']);
    }
   })
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
    this.minPrice = 0;
    this.maxPrice = 1000;
    this.loadProducts();
  }

  searchProducts(keyword: string, page: number = 0, size: number = this.pageSize): void {
    this.selectedCategory = null;
    this.currentPage = 0;
    this.productService.searchProducts(keyword, page, size).subscribe((data: Page<Product>) => {
      this.products = data.content;
      this.totalPages = data.totalPages;
      this.currentPage = data.number;
      this.pageNumbers = Array.from({ length: this.totalPages }, (_, k) => k);
      this.totalResults = data.totalElements;
    });
  }

  filterProducts(): void {
    this.productService.filterProducts(this.minPrice, this.maxPrice, this.minStockQuantity, this.currentPage, this.pageSize)
      .subscribe((data: Page<Product>) => {
        this.products = data.content;
        this.totalPages = data.totalPages;
        this.currentPage = data.number;
        this.pageNumbers = Array.from({ length: this.totalPages }, (_, k) => k);
        this.totalResults = data.totalElements;
      });
  }
}
