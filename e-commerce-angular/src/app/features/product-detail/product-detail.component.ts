import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../service/product.service';
import { environment } from '../../../environments/environment';
import { CartService } from '../../service/cart.service';
import { AuthService } from '../../service/auth.service';
import { RatingService } from '../../service/rating.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {

  product!: Product;
  apiThumbnailUrl = environment.apiUrl + '/products/uploads/';
  mainImage: string = '';
  currentImageIndex: number = 0; 
  quantity: number = 1;
  productId :number = 0;
  rating: number = 0;
  userRating: number = 0;


  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router : Router,
    private ratingService: RatingService
  ) {}

  ngOnInit(): void {
    this.productId = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    if (this.productId) {
      this.loadProductDetails();
      this.loadAverageRating();
    }
  }

  loadProductDetails() {
    this.productService.getProductById(this.productId).subscribe(
      (product: Product) => {
        this.product = product;
        this.mainImage = product.thumbnailUrl;
      },
      (error) => {
        console.error('Error fetching product details', error);
      }
    );
  }
  loadAverageRating() {
    this.ratingService.getAverageRating(this.productId).subscribe(
      (average: number) => {
        this.rating = average;
      },
      error => {
        console.error('Error getting average rating', error);
      }
    );
  }

  // Method to set the main image URL
  setMainImage(url: string) {
    this.mainImage = url;
  }

  // Method to navigate to previous thumbnail image
  prevThumbnail() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.setMainImage(this.product.photoUrls[this.currentImageIndex].url);
      if (this.currentImageIndex === 0) {
        this.setMainImage(this.product.thumbnailUrl);
      }
    }
  }

  // Method to navigate to next thumbnail image
  nextThumbnail() {
    if (this.currentImageIndex < this.product.photoUrls.length - 1) {
      this.currentImageIndex++;
      this.setMainImage(this.product.photoUrls[this.currentImageIndex].url);
    }
  }

  // Method to add to cart (replace with actual implementation)
  addToCart() {
    this.authService.getUser().subscribe(user => {
      if(user){
        const userId = user.userId;
  
        this.cartService.addProductToCart(userId, this.productId, this.quantity).subscribe({
          next: (cart) => console.log('Product added to cart', cart),
          error: (err) => console.error('Error adding product to cart:', err)
        });
      }else {
        // redirect to login page
        this.router.navigate(['/login']);
      }
     })
  }

  increaseQuantity(): void {
    if (this.quantity < this.product.stockQuantity) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // Generate an array with 5 elements for star ratings
  getStarArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  rateProduct(rating: number) {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.ratingService.addRating(this.productId, user.userId, rating).subscribe({
          next: () => {
            this.userRating = rating;
            this.loadAverageRating();
          },
          error: (error) => console.error('Error adding rating', error)
        });
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
