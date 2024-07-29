import { Component } from '@angular/core';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { ProductService } from '../../service/product.service';
import { Page } from '../../models/page';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css'
})
export class ProductManagementComponent {
  products: Product[] = [];
  categories: Category[] = [];
 
  totalItems = 0;
  selectedProduct: Product | null = null;
  searchKeyword = '';

  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 5;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(category?: string): void {
    this.productService.getAllProducts(this.currentPage, this.pageSize, category)
      .subscribe((page: Page<Product>) => {
        this.products = page.content;
        this.totalItems = page.totalElements;
        this.totalPages = page.totalPages;
      });
  }

  loadCategories(): void {
    this.productService.getCategories()
      .subscribe(categories => this.categories = categories);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  onSelectProduct(product: Product): void {
    this.selectedProduct = product;
  }

  onCreateProduct(product: Product, file: File): void {
    this.productService.createProduct(product, file)
      .subscribe(() => {
        this.loadProducts();
        // Reset form or show success message
      });
  }

  onUpdateProduct(product: Product): void {
    if (product.productId) {
      this.productService.updateProduct(product.productId, product)
        .subscribe(() => {
          this.loadProducts();
          this.selectedProduct = null;
        });
    }
  }

  onDeleteProduct(productId: number): void {
    this.productService.deleteProduct(productId)
      .subscribe(() => {
        this.loadProducts();
        if (this.selectedProduct?.productId === productId) {
          this.selectedProduct = null;
        }
      });
  }

  resetForm(): void {
    this.selectedProduct = null;
    // Reset any form controls if you're using reactive forms
  }
}
