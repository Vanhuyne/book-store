// shared/prime-ng.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SlideshowComponent } from './slideshow/slideshow.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule 
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    SlideshowComponent
  ],
  declarations: [
    NavbarComponent,
    FooterComponent,
    SlideshowComponent
  ]
})
export class SharedModule{}
