import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

interface Book {
  title: string;
  author: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface ReadingMaxim {
  text: string;
  author: string;
  backgroundImage: string;
}

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.css']
})
export class SlideshowComponent implements OnInit, OnDestroy {
  readingMaxims: ReadingMaxim[] = [
    {
      text: "A reader lives a thousand lives before he dies.",
      author: "George R.R. Martin",
      backgroundImage: "https://www.notion.so/images/page-cover/rijksmuseum_claesz_1628.jpg"
    },
    {
      text: "Reading is to the mind what exercise is to the body.",
      author: "Joseph Addison",
      backgroundImage: "https://images.unsplash.com/photo-1561927923-588e0577115e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=4800"
    },
    {
      text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
      author: "Dr. Seuss",
      backgroundImage: "https://www.notion.so/images/page-cover/rijksmuseum_jansz_1641.jpg"
    },
    {
      text: "Reading is a discount ticket to everywhere.",
      author: "Mary Schmich",
      backgroundImage: "https://www.notion.so/images/page-cover/rijksmuseum_jansz_1637.jpg"
    },
    {
      text: "A book is a dream that you hold in your hand.",
      author: "Neil Gaiman",
      backgroundImage: "https://www.notion.so/images/page-cover/rijksmuseum_rembrandt_1642.jpg"
    }
  ];
  
  currentIndex: number = 0;
  private intervalSubscription: Subscription | undefined;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startSlideshow();
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
  }

  startSlideshow(): void {
    this.intervalSubscription = interval(5000).subscribe(() => {
      this.nextSlide();
    });
  }

  stopSlideshow(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.readingMaxims.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.readingMaxims.length) % this.readingMaxims.length;
  }

  setCurrentSlide(index: number): void {
    this.currentIndex = index;
  }

  exploreBooks(): void {
    // Navigate to the product-list component and scroll to the element with id 'product-list'
      setTimeout(() => {
        const element = document.getElementById('product-list');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100); // Small delay to ensure the component has loaded
  }
}