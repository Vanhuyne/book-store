import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrl: './slideshow.component.css'
})
export class SlideshowComponent {
 
  ngOnInit(): void {
    initFlowbite();
  }
  
}
