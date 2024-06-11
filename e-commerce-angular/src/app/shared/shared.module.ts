// shared/prime-ng.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  imports: [
    CommonModule

  ],
  exports: [
    NavbarComponent,
    FooterComponent
  
  ],
  declarations: [
    NavbarComponent,
    FooterComponent
  ]
})
export class SharedModule{}
