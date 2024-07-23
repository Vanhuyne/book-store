import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../models/product';
import { environment } from '../../../environments/environment';
import { RatingService } from '../../service/rating.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  apiThumnailUrl = environment.apiUrl + '/products/uploads/';
  @Input() product!: Product ;
  @Output() addToCartClicked: EventEmitter<number> = new EventEmitter<number>();

  constructor(private ratingService: RatingService) {
  }

  ngOnInit(): void {
    this.getAverageRating();
  }
  addToCart(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.addToCartClicked.emit(this.product.productId);
  }


  getAverageRating(): void {
    this.ratingService.getAverageRating(this.product.productId).subscribe(
      (average: number) => {
        this.product.rating = average;
      },
      error => {
        console.error('Error getting average rating', error);
      }
    );
  }

  // Generate an array with 5 elements for star ratings
  getStarArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

}
